'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [step, setStep] = useState(1)
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
      // Update profile with charity & plan preference
      await supabase.from('profiles').update({
        selected_charity_id: form.charityId || null,
        charity_percentage: form.charityPct,
      }).eq('id', data.user.id)

      // Redirect to subscription checkout
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: form.plan, userId: data.user.id, email: form.email }),
      })
      const { url } = await res.json()
      if (url) {
        window.location.href = url
      } else {
        router.push('/dashboard')
      }
    }
  }

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">⛳</span>
            <span className="text-2xl font-black gradient-text">GolfGive</span>
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            {[1, 2].map(s => (
              <div key={s} className={`flex items-center gap-2 ${s < step ? 'opacity-50' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>{s}</div>
                {s < 2 && <div className="w-12 h-px bg-zinc-700" />}
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-black text-white">{step === 1 ? 'Create your account' : 'Choose your charity'}</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          {step === 1 ? (
            <form onSubmit={handleStep1} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
                <input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)} required placeholder="Jamie Robertson"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-green-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required placeholder="you@example.com"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-green-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-green-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Subscription Plan</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'monthly', label: 'Monthly', price: '£19.99/mo' },
                    { id: 'yearly', label: 'Yearly', price: '£199.99/yr', badge: 'Save 16%' },
                  ].map(p => (
                    <button key={p.id} type="button" onClick={() => update('plan', p.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${form.plan === p.id ? 'border-green-500 bg-green-500/5' : 'border-zinc-700 hover:border-zinc-600'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white text-sm">{p.label}</span>
                        {p.badge && <span className="text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">{p.badge}</span>}
                      </div>
                      <p className="text-zinc-400 text-xs">{p.price}</p>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-colors mt-2">
                Continue →
              </button>
              <p className="text-center text-sm text-zinc-500">
                Already a member? <Link href="/login" className="text-green-400 hover:text-green-300">Sign in</Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="flex flex-col gap-5">
              <p className="text-sm text-zinc-400">Select a charity to receive your contribution (min 10% of subscription).</p>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                {charities.map(c => (
                  <button key={c.id} type="button" onClick={() => update('charityId', c.id)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${form.charityId === c.id ? 'border-green-500 bg-green-500/5' : 'border-zinc-700 hover:border-zinc-600'}`}>
                    <p className="font-medium text-white text-sm">{c.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{c.description}</p>
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                  Charity Contribution: <span className="text-green-400">{form.charityPct}%</span>
                </label>
                <input type="range" min={10} max={100} value={form.charityPct} onChange={e => update('charityPct', +e.target.value)}
                  className="w-full accent-green-500" />
                <div className="flex justify-between text-xs text-zinc-600 mt-1"><span>10%</span><span>100%</span></div>
              </div>
              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <button type="submit" disabled={loading || !form.charityId}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Creating account…' : 'Join GolfGive →'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="text-sm text-zinc-500 hover:text-zinc-400">← Back</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
