'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Charity { id: string; name: string; description: string; image_url?: string; is_featured: boolean; upcoming_events: any[] }

export default function CharityPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [selected, setSelected] = useState('')
  const [pct, setPct] = useState(10)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from('profiles').select('selected_charity_id, charity_percentage').eq('id', user.id).single(),
        supabase.from('charities').select('*').eq('is_active', true).order('is_featured', { ascending: false }),
      ])
      setProfile(p)
      setCharities(c || [])
      setSelected(p?.selected_charity_id || '')
      setPct(p?.charity_percentage || 10)
    }
    load()
  }, [])

  async function save() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({
      selected_charity_id: selected || null,
      charity_percentage: pct,
    }).eq('id', user.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-black text-white mb-2">Your Charity</h1>
      <p className="text-zinc-400 mb-8">Choose where your contribution goes and set your percentage.</p>

      {/* Contribution slider */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-white mb-1">Charity Contribution</h2>
        <p className="text-sm text-zinc-400 mb-5">Minimum 10% of your subscription goes to charity. Increase it any time.</p>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl font-black gradient-text">{pct}%</span>
          <div className="flex-1">
            <input type="range" min={10} max={100} value={pct} onChange={e => setPct(+e.target.value)}
              className="w-full accent-green-500" />
            <div className="flex justify-between text-xs text-zinc-600 mt-1"><span>10% (min)</span><span>100%</span></div>
          </div>
        </div>
      </div>

      {/* Charity selection */}
      <h2 className="font-bold text-white mb-4">Choose a Charity</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {charities.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`text-left rounded-2xl border-2 overflow-hidden transition-all ${selected === c.id ? 'border-green-500' : 'border-zinc-800 hover:border-zinc-700'}`}
          >
            {c.image_url && (
              <img src={c.image_url} alt={c.name} className="w-full h-36 object-cover" />
            )}
            <div className="p-4 bg-zinc-900">
              <div className="flex items-center gap-2 mb-1">
                {c.is_featured && <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">⭐ Featured</span>}
                {selected === c.id && <span className="text-xs bg-green-500 text-black font-bold px-2 py-0.5 rounded-full">✓ Selected</span>}
              </div>
              <h3 className="font-bold text-white">{c.name}</h3>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{c.description}</p>
              {c.upcoming_events?.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-medium text-zinc-400">Upcoming Events:</p>
                  {c.upcoming_events.slice(0, 2).map((ev: any, i: number) => (
                    <p key={i} className="text-xs text-zinc-600">📅 {ev.title} — {ev.date}</p>
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={save}
        disabled={!selected}
        className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saved ? '✓ Saved!' : 'Save Charity Settings'}
      </button>
    </div>
  )
}
