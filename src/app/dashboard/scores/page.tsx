'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

interface Score { id: string; score: number; score_date: string }

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [form, setForm] = useState({ score: '', date: new Date().toISOString().split('T')[0] })
  const [editing, setEditing] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('golf_scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score_date', { ascending: false })
      .limit(5)
    setScores(data || [])
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const score = parseInt(form.score)
    if (score < 1 || score > 45) { setError('Score must be between 1 and 45'); return }
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (editing) {
      const { error: err } = await supabase.from('golf_scores').update({
        score, score_date: form.date, updated_at: new Date().toISOString(),
      }).eq('id', editing).eq('user_id', user.id)
      if (err) setError(err.message)
      setEditing(null)
    } else {
      const { error: err } = await supabase.from('golf_scores').insert({
        user_id: user.id, score, score_date: form.date,
      })
      if (err) {
        if (err.code === '23505') setError('You already have a score for this date. Edit or delete it.')
        else setError(err.message)
        setLoading(false)
        return
      }
    }
    setForm({ score: '', date: new Date().toISOString().split('T')[0] })
    await load()
    setLoading(false)
  }

  async function deleteScore(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('golf_scores').delete().eq('id', id).eq('user_id', user.id)
    load()
  }

  function startEdit(s: Score) {
    setEditing(s.id)
    setForm({ score: String(s.score), date: s.score_date })
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black text-white mb-2">Golf Scores</h1>
      <p className="text-zinc-400 mb-8">Your rolling last 5 Stableford scores. One score per date maximum.</p>

      {/* Entry form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-white mb-4">{editing ? '✏️ Edit Score' : '+ Add New Score'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={form.date}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            required
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 transition-colors"
          />
          <input
            type="number"
            value={form.score}
            onChange={e => setForm(f => ({ ...f, score: e.target.value }))}
            placeholder="Score (1–45)"
            min={1} max={45} required
            className="w-40 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? '…' : editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ score: '', date: new Date().toISOString().split('T')[0] }) }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-3 rounded-xl text-sm transition-colors">
              Cancel
            </button>
          )}
        </form>
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        <p className="text-xs text-zinc-600 mt-3">
          ⚡ Adding a 6th score automatically removes your oldest one.
        </p>
      </div>

      {/* Score list */}
      <div className="space-y-3">
        {scores.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-4xl mb-3">🏌️</p>
            <p className="text-zinc-400">No scores yet. Add your first round!</p>
          </div>
        ) : (
          scores.map((s, i) => (
            <div key={s.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-sm font-bold text-green-400">
                  #{i + 1}
                </div>
                <div>
                  <p className="text-white font-semibold">{formatDate(s.score_date)}</p>
                  <p className="text-xs text-zinc-500">Stableford</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-white">{s.score}</span>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(s)} className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                  <button onClick={() => deleteScore(s.id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {scores.length > 0 && (
        <div className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-500">
          Your draw entry numbers: <span className="text-green-400 font-bold">{scores.map(s => s.score).join(', ')}</span>
        </div>
      )}
    </div>
  )
}
