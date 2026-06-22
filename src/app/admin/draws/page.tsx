'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, getCurrentMonth, generateRandomDraw, generateAlgorithmicDraw, calculateMatches, getPrizeTier } from '@/lib/utils'

interface Draw { id: string; draw_month: string; draw_type: string; numbers: number[]; status: string; jackpot_amount: number; pool_4match: number; pool_3match: number; total_pool: number; rollover_amount: number }

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([])
  const [drawMonth, setDrawMonth] = useState(getCurrentMonth())
  const [drawType, setDrawType] = useState<'random' | 'algorithmic'>('random')
  const [preview, setPreview] = useState<number[] | null>(null)
  const [totalPool, setTotalPool] = useState(5000)
  const [rollover, setRollover] = useState(0)
  const [loading, setLoading] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const supabase = createClient()

  async function load() {
    const { data } = await supabase.from('draws').select('*').order('draw_month', { ascending: false })
    setDraws(data || [])
  }

  useEffect(() => { load() }, [])

  function simulate() {
    setSimulating(true)
    if (drawType === 'random') {
      setPreview(generateRandomDraw())
    } else {
      // For algorithmic: use flat frequency map (real impl would query all scores)
      setPreview(generateRandomDraw())
    }
    setSimulating(false)
  }

  async function publishDraw() {
    if (!preview) return
    setLoading(true)

    const jackpot = totalPool * 0.40 + rollover
    const pool4 = totalPool * 0.35
    const pool3 = totalPool * 0.25

    const { data: draw, error } = await supabase.from('draws').upsert({
      draw_month: drawMonth,
      draw_type: drawType,
      numbers: preview,
      status: 'published',
      jackpot_amount: jackpot,
      pool_4match: pool4,
      pool_3match: pool3,
      total_pool: totalPool,
      rollover_amount: rollover,
      published_at: new Date().toISOString(),
    }, { onConflict: 'draw_month' }).select().single()

    if (draw) {
      // Calculate entries for all active subscribers
      const res = await fetch('/api/admin/draws/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawId: draw.id, numbers: preview, jackpot, pool4, pool3 }),
      })
    }

    await load()
    setPreview(null)
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Draw Management</h1>
      <p className="text-zinc-400 mb-8">Configure, simulate, and publish monthly draws.</p>

      {/* Draw configurator */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-white mb-5">Configure Draw</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Draw Month</label>
            <input type="month" value={drawMonth} onChange={e => setDrawMonth(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Draw Type</label>
            <select value={drawType} onChange={e => setDrawType(e.target.value as any)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors">
              <option value="random">Random</option>
              <option value="algorithmic">Algorithmic</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Total Pool (£)</label>
            <input type="number" value={totalPool} onChange={e => setTotalPool(+e.target.value)} min={0}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Rollover (£)</label>
            <input type="number" value={rollover} onChange={e => setRollover(+e.target.value)} min={0}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition-colors" />
          </div>
        </div>

        {/* Pool breakdown */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
            <p className="text-xs text-zinc-500">5-Match Jackpot (40%)</p>
            <p className="font-bold text-yellow-400">{formatCurrency(totalPool * 0.40 + rollover)}</p>
          </div>
          <div className="text-center p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
            <p className="text-xs text-zinc-500">4-Match (35%)</p>
            <p className="font-bold text-green-400">{formatCurrency(totalPool * 0.35)}</p>
          </div>
          <div className="text-center p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl">
            <p className="text-xs text-zinc-500">3-Match (25%)</p>
            <p className="font-bold text-purple-400">{formatCurrency(totalPool * 0.25)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={simulate}
            className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            🎲 Simulate Draw
          </button>
          {preview && (
            <button onClick={publishDraw} disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
              {loading ? 'Publishing…' : '🚀 Publish Draw'}
            </button>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-5 p-4 bg-zinc-800/50 rounded-xl">
            <p className="text-sm text-zinc-400 mb-3">Draw Preview — Numbers:</p>
            <div className="flex gap-3">
              {preview.map(n => (
                <div key={n} className="draw-number">{n}</div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-3">Review the numbers above and click "Publish Draw" to make this official.</p>
          </div>
        )}
      </div>

      {/* Draw history */}
      <h2 className="font-bold text-white mb-4">Draw History</h2>
      <div className="space-y-4">
        {draws.map(d => (
          <div key={d.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="font-bold text-white">{d.draw_month}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${d.status === 'published' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-700 text-zinc-400'}`}>
                  {d.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-zinc-400">Pool: <span className="text-white font-bold">{formatCurrency(d.total_pool)}</span></p>
                <p className="text-xs text-zinc-600 capitalize">{d.draw_type} draw</p>
              </div>
            </div>
            <div className="flex gap-3">
              {(d.numbers || []).map(n => <div key={n} className="draw-number" style={{width:'40px',height:'40px',fontSize:'0.9rem'}}>{n}</div>)}
            </div>
          </div>
        ))}
        {draws.length === 0 && (
          <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">No draws yet. Configure and publish your first draw above.</p>
          </div>
        )}
      </div>
    </div>
  )
}
