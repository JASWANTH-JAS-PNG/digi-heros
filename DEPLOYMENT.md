# GolfGive — Deployment Guide

## Step 1: Supabase Setup (New Account)

1. Go to supabase.com → Create new account → New project
2. Wait for project to provision (~2 min)
3. Go to **SQL Editor** → paste contents of `supabase/schema.sql` → Run
4. Go to **Settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## Step 2: Stripe Setup

1. Go to stripe.com → Create account (use test mode)
2. Create two products in Dashboard → Products:
   - **Monthly**: £19.99/month recurring → copy Price ID → `STRIPE_MONTHLY_PRICE_ID`
   - **Yearly**: £199.99/year recurring → copy Price ID → `STRIPE_YEARLY_PRICE_ID`
3. Developers → API Keys:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
4. Webhooks → Add endpoint → URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

## Step 3: Vercel Deployment (New Account)

1. Push code to GitHub: new public repo `golf-charity-platform`
2. Go to vercel.com → Create new account → Import from GitHub
3. Add all environment variables from `.env.example`
4. Deploy → copy the live URL → set as `NEXT_PUBLIC_APP_URL`

## Step 4: Create Admin User

1. Sign up via the live site
2. In Supabase SQL Editor run:
   ```sql
   update public.profiles set role = 'admin' where email = 'your-email@example.com';
   ```
3. Log in → you'll be redirected to `/admin`

## Test Credentials (after setup)

- **Admin**: your email + password (after running SQL above)
- **Test Stripe card**: 4242 4242 4242 4242 · any date · any CVC

## Test Checklist

- [ ] Sign up → Stripe checkout → subscription active
- [ ] Log 5 golf scores (1-45 Stableford)
- [ ] Select charity and set contribution %
- [ ] Admin: run draw simulation → publish
- [ ] Draw entries automatically created for active subscribers
- [ ] Winner submits verification (if they won)
- [ ] Admin: approve + mark as paid
- [ ] Reports show correct totals
