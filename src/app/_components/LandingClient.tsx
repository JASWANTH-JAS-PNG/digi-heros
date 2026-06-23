'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  ChevronRight, ArrowRight, Trophy, Heart, BarChart3,
  Target, Shield, Zap, Check, Star, Gift
} from 'lucide-react'
import Particles from '@/components/Particles'
import { Navbar } from '@/components/Navbar'

function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 60
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

const features = [
  { icon: BarChart3, title: 'Score Tracking',      desc: 'Log your last 5 Stableford scores. We keep a rolling record — automatic and effortless.',         color: 'bg-gradient-to-br from-indigo-500 to-indigo-700',  delay: 0.1 },
  { icon: Target,    title: 'Monthly Prize Draws',  desc: 'Five numbers drawn every month. Match 3, 4, or all 5 of your scores to win big.',                  color: 'bg-gradient-to-br from-purple-500 to-purple-700',  delay: 0.2 },
  { icon: Heart,     title: 'Charity Contributions',desc: 'Minimum 10% of your subscription goes to your chosen charity. Increase any time you like.',        color: 'bg-gradient-to-br from-rose-500 to-rose-700',      delay: 0.3 },
  { icon: Trophy,    title: 'Jackpot Rollovers',    desc: 'No 5-match winner? The jackpot rolls into next month — it keeps growing until someone claims it.',  color: 'bg-gradient-to-br from-amber-500 to-amber-700',    delay: 0.4 },
  { icon: Shield,    title: 'Verified Winners',     desc: 'Upload your score screenshot. Admins verify before a penny is paid. Fully transparent.',            color: 'bg-gradient-to-br from-cyan-500 to-cyan-700',      delay: 0.5 },
  { icon: Zap,       title: 'Instant Notifications',desc: 'Know the moment draws are published and if you\'ve matched numbers. Never miss a win.',             color: 'bg-gradient-to-br from-emerald-500 to-emerald-700',delay: 0.6 },
]

const stats = [
  { value: 12400, prefix: '£', suffix: '', label: 'Paid to winners' },
  { value: 8200,  prefix: '£', suffix: '', label: 'Donated to charity' },
  { value: 2400,  prefix: '',  suffix: '+', label: 'Active players' },
  { value: 12,    prefix: '',  suffix: '',  label: 'Monthly draws run' },
]

const prizes = [
  { match: '5 Numbers', pct: '40%', label: 'Jackpot',      note: 'Rolls over if unclaimed',    color: 'from-amber-500 to-orange-600',  glow: 'rgba(245,158,11,0.3)' },
  { match: '4 Numbers', pct: '35%', label: 'Second Prize', note: 'Split among all winners',    color: 'from-indigo-500 to-purple-600', glow: 'rgba(99,102,241,0.3)' },
  { match: '3 Numbers', pct: '25%', label: 'Third Prize',  note: 'Split among all winners',    color: 'from-cyan-500 to-cyan-700',     glow: 'rgba(6,182,212,0.3)'  },
]

export default function LandingClient({ user, charities }: { user: any; charities: any[] }) {
  const mockScores = [28, 32, 35, 31, 29]

  return (
    <div className="min-h-screen animated-bg overflow-hidden">
      <Particles count={55} />
      <Navbar user={user} />

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center hero-grid pt-16">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-300" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Monthly draws now live — join 2,400+ players
            <ChevronRight size={14} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-extrabold leading-tight mb-6"
          >
            Play Golf.{' '}
            <span className="gradient-text block sm:inline">Win Big.</span>
            <br className="hidden sm:block" />
            Give Back.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Track your Stableford scores, enter monthly prize draws, and support the charities that matter — all on one platform built for modern golfers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/signup"
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-lg neon-indigo hover:from-indigo-400 hover:to-purple-500 transition-all duration-300"
            >
              Start Playing Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all duration-300"
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Score preview card */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="relative mx-auto max-w-2xl"
          >
            <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="ml-3 text-slate-500 text-xs">GolfGive — Your Last 5 Scores</span>
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                {mockScores.map((score, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.2))',
                      border: '1px solid rgba(99,102,241,0.4)',
                    }}
                  >
                    <span className="gradient-text">{score}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Stableford points per round</span>
                <span className="text-indigo-400 font-medium">Draw eligible ✓</span>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 glass rounded-xl px-4 py-2 border border-emerald-500/30"
            >
              <span className="text-emerald-400 text-sm font-semibold">🎉 3-match win — £420!</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-2 border border-purple-500/30"
            >
              <span className="text-purple-400 text-sm font-semibold">❤️ £2 to charity this month</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────── */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, prefix, suffix, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 text-center border-gradient"
              >
                <div className="text-3xl font-extrabold gradient-text mb-1">
                  <Counter target={value} prefix={prefix} suffix={suffix} />
                </div>
                <div className="text-slate-400 text-sm">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">Simple. Transparent. Rewarding.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Three steps between you and a life-changing prize draw.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8">
            {features.slice(0, 3).map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: f.delay, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-2xl p-6 border-gradient card-hover group"
              >
                <div className="text-xs font-bold text-indigo-400 mb-3 tracking-widest">0{i + 1}</div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Prize Pool ───────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-purple-400 font-semibold text-sm uppercase tracking-wider">Prize Pool</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">How Prizes Are Split</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Every subscription contributes. Match numbers, win a share.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {prizes.map((p, i) => (
              <motion.div
                key={p.match}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-2xl p-6 text-center border-gradient card-hover"
                style={{ boxShadow: `0 4px 30px ${p.glow}` }}
              >
                <div className={`text-5xl font-extrabold bg-gradient-to-r ${p.color} bg-clip-text text-transparent mb-3`}>
                  {p.pct}
                </div>
                <p className="font-bold text-white">{p.match}</p>
                <p className="text-sm text-slate-400 mt-1">{p.label}</p>
                <p className="text-xs text-slate-500 mt-2">{p.note}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-5 text-center border border-amber-500/20"
          >
            <p className="text-amber-400 font-medium">🎰 Jackpot rolls over every month until someone matches all 5!</p>
          </motion.div>
        </div>
      </section>

      {/* ─── Platform Features ────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wider">Platform</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">Everything You Need</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: f.delay, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-2xl p-6 border-gradient card-hover group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Charities ────────────────────────────────── */}
      {charities.length > 0 && (
        <section id="charities" className="py-24 px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-rose-400 font-semibold text-sm uppercase tracking-wider">Charity</span>
              <h2 className="text-4xl font-bold text-white mt-2 mb-4">Make a Real Difference</h2>
              <p className="text-slate-400">Choose where your contribution goes every month.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {charities.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="glass rounded-2xl overflow-hidden border border-white/10 card-hover"
                >
                  {c.image_url && (
                    <img src={c.image_url} alt={c.name} className="w-full h-32 object-cover" />
                  )}
                  <div className="p-4">
                    {c.is_featured && (
                      <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                    <h3 className="font-bold text-white mt-2 mb-1">{c.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3">{c.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/signup" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign up to choose your charity <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Pricing ──────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">Pricing</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">All plans include draws, score tracking, and charity contribution.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="glass rounded-3xl p-8 border-gradient card-hover"
            >
              <h3 className="text-xl font-bold text-white mb-1">Monthly</h3>
              <p className="text-slate-500 text-sm mb-6">Flexible. Cancel anytime.</p>
              <div className="text-4xl font-extrabold text-white mb-1">
                £19.99<span className="text-lg text-slate-500 font-normal">/mo</span>
              </div>
              <p className="text-xs text-slate-600 mb-8">Incl. £2+ to charity each month</p>
              <ul className="space-y-2 mb-8">
                {['Monthly prize draw entry', 'Score tracking', 'Charity contribution'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <Check size={14} className="text-indigo-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup?plan=monthly"
                className="block text-center glass border border-white/10 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Start Monthly
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative glass rounded-3xl p-8 card-hover"
              style={{ border: '2px solid transparent', background: 'linear-gradient(#0a0a0f, #0a0a0f) padding-box, linear-gradient(135deg, #6366f1, #a855f7) border-box', boxShadow: '0 0 30px rgba(99,102,241,0.2)' }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 neon-indigo">
                  BEST VALUE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Yearly</h3>
              <p className="text-slate-500 text-sm mb-6">Save over 16%. Best value.</p>
              <div className="text-4xl font-extrabold text-white mb-1">
                £199.99<span className="text-lg text-slate-500 font-normal">/yr</span>
              </div>
              <p className="text-xs text-indigo-400 mb-8">Save £40/yr — equiv. £16.67/mo</p>
              <ul className="space-y-2 mb-8">
                {['Monthly prize draw entry', 'Score tracking', 'Charity contribution', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <Check size={14} className="text-purple-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup?plan=yearly"
                className="block text-center py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold neon-indigo hover:from-indigo-400 hover:to-purple-500 transition-all"
              >
                Start Yearly — Best Deal
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-cyan-600 opacity-90" />
            <div className="absolute inset-0 hero-grid opacity-20" />
            <div className="relative p-12 text-center">
              <h2 className="text-4xl font-extrabold text-white mb-4">Ready to play?</h2>
              <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
                Join thousands of golfers already playing, winning, and giving back to the charities they care about.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 transition-all"
                >
                  Join GolfGive Free
                </Link>
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 border border-white/20 transition-all"
                >
                  Sign In
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-indigo-200 text-sm flex-wrap">
                {['No commitment', 'Cancel anytime', '24/7 support'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check size={14} className="text-emerald-400" />{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-4 relative z-10">
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
