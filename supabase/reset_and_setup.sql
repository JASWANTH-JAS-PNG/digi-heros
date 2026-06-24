-- ============================================================
-- FULL RESET — drops everything and rebuilds from scratch
-- ============================================================

drop schema if exists public cascade;
create schema public;
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables    in schema public to postgres, anon, authenticated, service_role;
grant all on all routines  in schema public to postgres, anon, authenticated, service_role;
grant all on all sequences in schema public to postgres, anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on tables    to postgres, anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on routines  to postgres, anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on sequences to postgres, anon, authenticated, service_role;

create extension if not exists "uuid-ossp";

-- CHARITIES (no FK deps, created first)
create table public.charities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image_url text,
  website_url text,
  is_featured boolean default false,
  is_active boolean default true,
  upcoming_events jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- PROFILES
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'subscriber' check (role in ('subscriber', 'admin')),
  subscription_status text not null default 'inactive' check (subscription_status in ('active', 'inactive', 'cancelled', 'lapsed')),
  subscription_plan text check (subscription_plan in ('monthly', 'yearly')),
  subscription_id text,
  subscription_end_date timestamptz,
  selected_charity_id uuid references public.charities(id) on delete set null,
  charity_percentage integer not null default 10 check (charity_percentage >= 10 and charity_percentage <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- GOLF SCORES
create table public.golf_scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer not null check (score >= 1 and score <= 45),
  score_date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, score_date)
);

-- DRAWS
create table public.draws (
  id uuid default uuid_generate_v4() primary key,
  draw_month text not null,
  draw_type text not null default 'random' check (draw_type in ('random', 'algorithmic')),
  numbers integer[] not null,
  status text not null default 'pending' check (status in ('pending', 'simulated', 'published')),
  jackpot_amount numeric(10,2) default 0,
  pool_4match numeric(10,2) default 0,
  pool_3match numeric(10,2) default 0,
  total_pool numeric(10,2) default 0,
  rollover_amount numeric(10,2) default 0,
  notes text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(draw_month)
);

-- DRAW ENTRIES
create table public.draw_entries (
  id uuid default uuid_generate_v4() primary key,
  draw_id uuid references public.draws(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  scores integer[] not null,
  match_count integer default 0,
  prize_tier text check (prize_tier in ('5-match', '4-match', '3-match', 'none')),
  prize_amount numeric(10,2) default 0,
  created_at timestamptz default now(),
  unique(draw_id, user_id)
);

-- WINNER VERIFICATIONS
create table public.winner_verifications (
  id uuid default uuid_generate_v4() primary key,
  draw_entry_id uuid references public.draw_entries(id) on delete cascade not null unique,
  user_id uuid references public.profiles(id) on delete cascade not null,
  screenshot_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_notes text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- SUBSCRIPTION PAYMENTS
create table public.subscription_payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_payment_id text,
  amount numeric(10,2) not null,
  plan text not null,
  charity_contribution numeric(10,2) default 0,
  prize_pool_contribution numeric(10,2) default 0,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- RLS
alter table public.charities enable row level security;
alter table public.profiles enable row level security;
alter table public.golf_scores enable row level security;
alter table public.draws enable row level security;
alter table public.draw_entries enable row level security;
alter table public.winner_verifications enable row level security;
alter table public.subscription_payments enable row level security;

-- POLICIES
create policy "Anyone can view active charities" on public.charities for select using (is_active = true);
create policy "Admins can manage charities" on public.charities for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Users can manage own scores" on public.golf_scores for all using (auth.uid() = user_id);
create policy "Admins can view all scores" on public.golf_scores for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Anyone can view published draws" on public.draws for select using (status = 'published' or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can manage draws" on public.draws for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Users can view own entries" on public.draw_entries for select using (auth.uid() = user_id);
create policy "Admins can manage draw entries" on public.draw_entries for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Users can manage own verifications" on public.winner_verifications for all using (auth.uid() = user_id);
create policy "Admins can manage all verifications" on public.winner_verifications for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Users can view own payments" on public.subscription_payments for select using (auth.uid() = user_id);
create policy "Admins can view all payments" on public.subscription_payments for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- TRIGGER: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- TRIGGER: keep only 5 scores per user
create or replace function public.limit_scores_to_five()
returns trigger as $$
begin
  delete from public.golf_scores
  where user_id = new.user_id
    and id not in (
      select id from public.golf_scores
      where user_id = new.user_id
      order by score_date desc
      limit 5
    );
  return new;
end;
$$ language plpgsql security definer;

create trigger enforce_five_score_limit
  after insert on public.golf_scores
  for each row execute procedure public.limit_scores_to_five();

-- SEED charities
insert into public.charities (name, description, image_url, is_featured) values
('Green Fairways Foundation', 'Connecting golf with conservation — restoring natural habitats across the UK through community-led projects.', 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=600', true),
('Youth Golf Initiative', 'Breaking barriers in golf by giving underprivileged young people access to coaching and equipment.', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=600', false),
('Cancer Research Putters', 'Raising vital funds for cancer research through golf competitions and community fundraising events.', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600', false),
('Mental Health on the Green', 'Using the therapeutic power of golf to support mental health and fund counselling services.', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600', true);
