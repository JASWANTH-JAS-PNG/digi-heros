'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    plan: params.get('plan') || 'monthly',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data, error: err } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName },
          emailRedirectTo: `${location.origin}/dashboard`,
        },
      })

      if (err) { setError(err.message); return }

      if (data.user) {
        try {
          const res = await fetch('/api/subscriptions/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: form.plan, userId: data.user.id, email: form.email }),
          })
          const json = await res.json()
          if (json.url) { window.location.href = json.url; return }
        } catch {
          // Stripe not configured yet
        }
        router.push('/dashboard')
      }
    } catch {
      setError('Unable to connect. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

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
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center neon-indigo">
              <span className="text-xl">⛳</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">Join GolfGive in under a minute</p>
        </div>

        <div className="glass rounded-3xl p-8 border-gradient shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-5"
            >
              <AlertCircle size={15} className="flex-shrink-0" />{error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
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

            {/* Plan */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Plan</label>
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
                      {p.badge && <span className="text-xs bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded">{p.badge}</span>}
                    </div>
                    <p className="text-slate-400 text-xs">{p.price}</p>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold neon-indigo hover:from-indigo-400 hover:to-purple-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Create Account</span><ArrowRight size={16} /></>
              }
            </motion.button>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-1">
              {['Cancel anytime', 'Min 10% to charity'].map(t => (
                <span key={t} className="flex items-center gap-1"><Check size={11} className="text-indigo-400" />{t}</span>
              ))}
            </div>

            <p className="text-center text-sm text-slate-500">
              Already a member?{' '}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
