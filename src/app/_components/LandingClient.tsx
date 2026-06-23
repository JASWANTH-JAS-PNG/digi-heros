'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { ArrowRight, Trophy, Heart, BarChart3, Target, Shield, Zap, Check } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

function fadeUp(delay = 0): Partial<HTMLMotionProps<'div'>> {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay },
  }
}

const features = [
  { icon: BarChart3, title: 'Score Tracking',       desc: 'Log your last 5 Stableford scores. We keep a rolling record — automatic and effortless.',        color: 'from-indigo-500 to-indigo-700' },
  { icon: Target,    title: 'Monthly Prize Draws',   desc: 'Five numbers drawn every month. Match 3, 4, or all 5 of your scores to win big.',                 color: 'from-purple-500 to-purple-700' },
  { icon: Heart,     title: 'Charity Contributions', desc: 'Minimum 10% of your subscription goes to your chosen charity. Increase any time.',               color: 'from-rose-500 to-rose-700' },
  { icon: Trophy,    title: 'Jackpot Rollovers',     desc: 'No 5-match winner? The jackpot rolls over — keeps growing until someone claims it.',              color: 'from-amber-500 to-amber-700' },
  { icon: Shield,    title: 'Verified Winners',      desc: 'Upload your score screenshot. Admins verify before payment. Fully transparent.',                  color: 'from-cyan-500 to-cyan-700' },
  { icon: Zap,       title: 'Instant Alerts',        desc: 'Know the moment draws are published and whether you matched. Never miss a win.',                  color: 'from-emerald-500 to-emerald-700' },
]

const prizes = [
  { match: '5 Numbers', pct: '40%', label: 'Jackpot',      note: 'Rolls over if unclaimed', grad: 'from-amber-500 to-orange-500' },
  { match: '4 Numbers', pct: '35%', label: 'Second Prize', note: 'Split among winners',     grad: 'from-indigo-500 to-purple-600' },
  { match: '3 Numbers', pct: '25%', label: 'Third Prize',  note: 'Split among winners',     grad: 'from-cyan-500 to-cyan-700' },
]

const stats = [
  { val: '£12,400', label: 'Paid to winners' },
  { val: '£8,200',  label: 'Donated to charity' },
  { val: '2,400+',  label: 'Active players' },
  { val: '12',      label: 'Monthly draws run' },
]

export default function LandingClient({ user, charities }: { user: any; charities: any[] }) {
  return (
    <div className="min-h-screen animated-bg">
      <Navbar user={user} />

      {/* Hero */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Monthly draws now live — join 2,400+ players
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="text-5xl sm:text-7xl font-extrabold leading-tight mb-6 text-white">
            Play Golf.{' '}
            <span className="gradient-text">Win Big.</span>
            <br />Give Back.
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track your Stableford scores, enter monthly prize draws, and support the charities that matter — all on one platform built for modern golfers.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg neon-indigo hover:from-indigo-400 hover:to-purple-500 transition-all duration-300">
              Start Playing Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how-it-works" className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all duration-300">
              See How It Works
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div {...fadeUp(0.4)} className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center border-gradient">
                <p className="text-2xl font-extrabold gradient-text">{s.val}</p>
                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-3">Simple. Transparent. Rewarding.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Three steps between you and a prize draw.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {features.slice(0, 3).map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.1)} whileHover={{ y: -6 }} className="glass rounded-2xl p-6 border-gradient card-hover">
                <div className="text-xs font-bold text-indigo-400 mb-3 tracking-widest">0{i + 1}</div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${f.color}`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Pool */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">Prize Pool</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-3">How Prizes Are Split</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Every subscription contributes. Match numbers, win a share.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            {prizes.map((p, i) => (
              <motion.div key={p.match} {...fadeUp(i * 0.1)} whileHover={{ y: -6 }} className="glass rounded-2xl p-6 text-center border-gradient card-hover">
                <div className={`text-5xl font-extrabold bg-gradient-to-r ${p.grad} bg-clip-text text-transparent mb-3`}>{p.pct}</div>
                <p className="font-bold text-white">{p.match}</p>
                <p className="text-sm text-slate-400 mt-1">{p.label}</p>
                <p className="text-xs text-slate-500 mt-2">{p.note}</p>
              </motion.div>
            ))}
          </div>
          <div className="glass rounded-xl p-4 text-center border border-amber-500/20">
            <p className="text-amber-400 text-sm font-medium">🎰 Jackpot rolls over every month until someone matches all 5 numbers!</p>
          </div>
        </div>
      </section>

      {/* All Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Platform</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-3">Everything You Need</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp(i * 0.08)} whileHover={{ y: -6 }} className="glass rounded-2xl p-6 border-gradient card-hover">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${f.color}`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Charities */}
      {charities.length > 0 && (
        <section id="charities" className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeUp(0)} className="text-center mb-14">
              <span className="text-rose-400 font-semibold text-sm uppercase tracking-wider">Charity</span>
              <h2 className="text-4xl font-bold text-white mt-2 mb-3">Make a Real Difference</h2>
              <p className="text-slate-400">Choose where your contribution goes every month.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {charities.map((c, i) => (
                <motion.div key={c.id} {...fadeUp(i * 0.08)} whileHover={{ y: -6 }} className="glass rounded-2xl overflow-hidden border border-white/10 card-hover">
                  {c.image_url && <img src={c.image_url} alt={c.name} className="w-full h-32 object-cover" />}
                  <div className="p-4">
                    {c.is_featured && <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">⭐ Featured</span>}
                    <h3 className="font-bold text-white mt-2 mb-1">{c.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3">{c.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-center mt-8">
              <Link href="/signup" className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-colors">
                Sign up to choose your charity <ArrowRight size={13} />
              </Link>
            </p>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-3">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">All plans include draws, score tracking, and charity contribution.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div {...fadeUp(0.1)} whileHover={{ y: -6 }} className="glass rounded-3xl p-8 border-gradient card-hover">
              <h3 className="text-xl font-bold text-white mb-1">Monthly</h3>
              <p className="text-slate-500 text-sm mb-5">Flexible. Cancel anytime.</p>
              <div className="text-4xl font-extrabold text-white mb-1">£19.99<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <p className="text-xs text-slate-600 mb-7">Incl. £2+ to charity each month</p>
              <ul className="space-y-2 mb-7">
                {['Monthly prize draw entry', 'Score tracking', 'Charity contribution'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400"><Check size={14} className="text-indigo-400 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link href="/signup?plan=monthly" className="block text-center glass border border-white/10 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-all">
                Start Monthly
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.2)} whileHover={{ y: -6 }} className="relative glass rounded-3xl p-8 card-hover" style={{ border: '2px solid transparent', background: 'linear-gradient(#0a0a0f, #0a0a0f) padding-box, linear-gradient(135deg, #6366f1, #a855f7) border-box' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600">BEST VALUE</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Yearly</h3>
              <p className="text-slate-500 text-sm mb-5">Save over 16%. Best value.</p>
              <div className="text-4xl font-extrabold text-white mb-1">£199.99<span className="text-lg text-slate-500 font-normal">/yr</span></div>
              <p className="text-xs text-indigo-400 mb-7">Save £40/yr — equiv. £16.67/mo</p>
              <ul className="space-y-2 mb-7">
                {['Monthly prize draw entry', 'Score tracking', 'Charity contribution', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400"><Check size={14} className="text-purple-400 flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link href="/signup?plan=yearly" className="block text-center py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-400 hover:to-purple-500 transition-all">
                Start Yearly — Best Deal
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp(0)} className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-cyan-600" />
            <div className="relative p-12 text-center">
              <h2 className="text-4xl font-extrabold text-white mb-4">Ready to play?</h2>
              <p className="text-indigo-200 mb-8 max-w-lg mx-auto">Join thousands of golfers already playing, winning, and giving back.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 transition-all">Join GolfGive Free</Link>
                <Link href="/login" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 border border-white/20 transition-all">Sign In</Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-indigo-200 text-sm flex-wrap">
                {['No commitment', 'Cancel anytime', '24/7 support'].map(t => (
                  <span key={t} className="flex items-center gap-1.5"><Check size={14} className="text-emerald-400" />{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛳</span>
            <span className="font-bold gradient-text">GolfGive</span>
          </div>
          <p className="text-slate-600 text-sm">© 2026 GolfGive. Play. Win. Give.</p>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/login" className="hover:text-slate-400 transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-slate-400 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
