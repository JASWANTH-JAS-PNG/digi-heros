'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [step, setStep] = useState(1)
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    plan: params.get('plan') || 'monthly',
    charityId: '',
    charityPct: 10,
  })
  const [charities, setCharities] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function loadCharities() {
    const supabase = createClient()
    const { data } = await supabase.from('charities').select('id, name, description').eq('is_active', true)
    setCharities(data || [])
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setStep(2)
    await loadCharities()
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data, error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName },
        emailRedirectTo: `${location.origin}/dashboard`,
      },
    })

    if (err) { setError(err.message); setLoading(false); return }

    if (data.user) {
      await supabase.from('profiles').update({
        selected_charity_id: form.charityId || null,
        charity_percentage: form.charityPct,
      }).eq('id', data.user.id)

      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: form.plan, userId: data.user.id, email: form.email }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
      else router.push('/dashboard')
    }
  }

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center neon-indigo">
              <span className="text-xl">⛳</span>
            </div>
          </Link>
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : step === s
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white neon-indigo'
                    : 'glass border border-white/10 text-slate-500'
                }`}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                {s < 2 && (
                  <div className={`w-12 h-px transition-all ${step > s ? 'bg-indigo-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-white">
            {step === 1 ? 'Create your account' : 'Choose your charity'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {step === 1 ? 'Join GolfGive in under a minute' : 'Select where your contribution goes'}
          </p>
        </div>

        <div className="glass rounded-3xl p-8 border-gradient shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleStep1}
                className="space-y-4"
              >
                {/* Full Name */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={e => update('fullName', e.target.value)}
                      required
                      placeholder="Jamie Robertson"
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 rounded-xl glass border border-white/10 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Plan selector */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Subscription Plan</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'monthly', label: 'Monthly', price: '£19.99/mo' },
                      { id: 'yearly',  label: 'Yearly',  price: '£199.99/yr', badge: 'Save 16%' },
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => update('plan', p.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${
                          form.plan === p.id
                            ? 'border-indigo-500 bg-indigo-500/10'
                            : 'border-white/10 hover:border-white/20 glass'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white text-sm">{p.label}</span>
                          {p.badge && (
                            <span className="text-xs bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">{p.badge}</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs">{p.price}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold neon-indigo hover:from-indigo-400 hover:to-purple-500 transition-all mt-2"
                >
                  Continue <ArrowRight size={16} />
                </motion.button>

                <p className="text-center text-sm text-slate-500">
                  Already a member?{' '}
                  <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <p className="text-sm text-slate-400">Select a charity to receive your contribution (min 10%).</p>

                <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                  {charities.length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-sm">Loading charities…</div>
                  )}
                  {charities.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => update('charityId', c.id)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${
                        form.charityId === c.id
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-white/10 hover:border-white/20 glass'
                      }`}
                    >
                      <p className="font-medium text-white text-sm">{c.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{c.description}</p>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Charity Contribution:{' '}
                    <span className="text-indigo-400">{form.charityPct}%</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={form.charityPct}
                    onChange={e => update('charityPct', +e.target.value)}
                    className="w-full accent-indigo-500"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>10%</span><span>100%</span>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                  >
                    <AlertCircle size={15} className="flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading || !form.charityId}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold neon-indigo hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><span>Join GolfGive</span><ArrowRight size={16} /></>
                  }
                </motion.button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-slate-500 hover:text-slate-400 transition-colors"
                >
                  ← Back
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
