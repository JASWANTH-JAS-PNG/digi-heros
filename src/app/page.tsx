import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/Navbar'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .limit(4)

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar user={user} />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(34,197,94,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.08)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Monthly draws now live — join 2,400+ players
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Play Golf.<br />
            <span className="gradient-text">Win Big.</span><br />
            Give Back.
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track your Stableford scores, enter monthly prize draws, and support the charities that matter to you — all on one platform built for modern golfers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-black font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl shadow-green-500/20"
            >
              Start Playing — Join Now
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-sm text-zinc-600 mt-6">No commitment. Cancel anytime.</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-800 bg-zinc-900/50 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 px-4">
          {[
            { val: '£12,400', label: 'Paid out to winners' },
            { val: '£8,200', label: 'Donated to charity' },
            { val: '2,400+', label: 'Active players' },
            { val: '12', label: 'Monthly draws run' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black gradient-text">{s.val}</p>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">How GolfGive Works</h2>
            <p className="text-zinc-400 text-lg">Simple, transparent, rewarding.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: '🏌️',
                title: 'Enter Your Scores',
                desc: 'Log your last 5 Stableford scores after each round. We keep a rolling record — simple and automatic.',
              },
              {
                step: '02',
                icon: '🎯',
                title: 'Enter Monthly Draws',
                desc: '5 numbers are drawn each month. Match 3, 4, or all 5 of your scores to win a share of the prize pool.',
              },
              {
                step: '03',
                icon: '❤️',
                title: 'Give to Charity',
                desc: 'A minimum 10% of your subscription goes directly to your chosen charity. Increase it any time.',
              },
            ].map(item => (
              <div key={item.step} className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 card-hover">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-xs font-bold text-green-500 mb-2 tracking-widest">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Pool */}
      <section className="py-24 px-4 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">The Prize Pool</h2>
            <p className="text-zinc-400 text-lg">Every subscription contributes. Here's how prizes are split.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              { match: '5 Numbers', pct: '40%', label: 'Jackpot', color: 'from-yellow-500 to-orange-500', note: 'Rolls over if unclaimed' },
              { match: '4 Numbers', pct: '35%', label: 'Second Prize', color: 'from-green-500 to-emerald-500', note: 'Split among winners' },
              { match: '3 Numbers', pct: '25%', label: 'Third Prize', color: 'from-purple-500 to-indigo-500', note: 'Split among winners' },
            ].map(p => (
              <div key={p.match} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                <div className={`text-4xl font-black bg-gradient-to-r ${p.color} bg-clip-text text-transparent mb-2`}>{p.pct}</div>
                <p className="font-bold text-white">{p.match} Match</p>
                <p className="text-sm text-zinc-500 mt-1">{p.label}</p>
                <p className="text-xs text-zinc-600 mt-2">{p.note}</p>
              </div>
            ))}
          </div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center">
            <p className="text-green-400 font-medium">🎰 Jackpot rolls over every month until someone wins all 5!</p>
          </div>
        </div>
      </section>

      {/* Charities */}
      <section id="charities" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Make a Real Difference</h2>
            <p className="text-zinc-400 text-lg">Choose where your contribution goes every month.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(charities || []).map(c => (
              <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden card-hover">
                {c.image_url && (
                  <img src={c.image_url} alt={c.name} className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  {c.is_featured && (
                    <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                  <h3 className="font-bold text-white mt-2 mb-1">{c.name}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-3">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              Sign up to choose your charity →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-zinc-900/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-zinc-400">All plans include draws, score tracking, and charity contribution.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 card-hover">
              <h3 className="text-xl font-bold text-white mb-1">Monthly</h3>
              <p className="text-zinc-500 text-sm mb-6">Flexible. Cancel anytime.</p>
              <div className="text-4xl font-black text-white mb-1">£19.99<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
              <p className="text-xs text-zinc-600 mb-8">Incl. £2+ to charity each month</p>
              <Link
                href="/signup?plan=monthly"
                className="block text-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Start Monthly
              </Link>
            </div>
            <div className="relative bg-zinc-900 border-2 border-green-500 rounded-3xl p-8 card-hover shadow-xl shadow-green-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Yearly</h3>
              <p className="text-zinc-500 text-sm mb-6">Save over 16%. Best value.</p>
              <div className="text-4xl font-black text-white mb-1">£199.99<span className="text-lg text-zinc-500 font-normal">/yr</span></div>
              <p className="text-xs text-zinc-600 mb-8">Equiv. £16.67/mo — you save £40/yr</p>
              <Link
                href="/signup?plan=yearly"
                className="block text-center bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors"
              >
                Start Yearly — Best Deal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-5xl font-black text-white mb-6">Ready to play?</h2>
          <p className="text-zinc-400 text-lg mb-10">Join thousands of golfers already playing, winning, and giving.</p>
          <Link
            href="/signup"
            className="inline-block bg-green-500 hover:bg-green-400 text-black font-bold text-xl px-10 py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-green-500/20"
          >
            Join GolfGive — It's Free to Try
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛳</span>
            <span className="font-bold gradient-text">GolfGive</span>
          </div>
          <p className="text-zinc-600 text-sm">© 2024 GolfGive. Play. Win. Give.</p>
          <div className="flex gap-4 text-sm text-zinc-600">
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
