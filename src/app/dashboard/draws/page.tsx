import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function DrawsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: draws } = await supabase
    .from('draws')
    .select(`
      *,
      draw_entries!left(match_count, prize_tier, prize_amount, user_id)
    `)
    .eq('status', 'published')
    .order('draw_month', { ascending: false })

  // Filter entries for current user
  const drawsWithMyEntry = (draws || []).map(d => ({
    ...d,
    myEntry: d.draw_entries?.find((e: any) => e.user_id === user.id) || null,
  }))

  const totalWon = drawsWithMyEntry.reduce((s, d) => s + (d.myEntry?.prize_amount || 0), 0)
  const drawsEntered = drawsWithMyEntry.filter(d => d.myEntry).length

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Monthly Draws</h1>
      <p className="text-zinc-400 mb-8">Results for all published draws.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-xs text-zinc-500 mb-1">Draws Entered</p>
          <p className="text-2xl font-bold text-white">{drawsEntered}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-xs text-zinc-500 mb-1">Total Won</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalWon)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-xs text-zinc-500 mb-1">Total Draws</p>
          <p className="text-2xl font-bold text-white">{draws?.length || 0}</p>
        </div>
      </div>

      {drawsWithMyEntry.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-zinc-400">No draws have been published yet.</p>
          <p className="text-sm text-zinc-600 mt-1">Check back after the monthly draw date.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drawsWithMyEntry.map(draw => (
            <div key={draw.id} className={`bg-zinc-900 border rounded-2xl p-6 ${draw.myEntry?.prize_tier && draw.myEntry.prize_tier !== 'none' ? 'border-green-500/30' : 'border-zinc-800'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-bold text-white">Draw — {draw.draw_month}</h2>
                  <p className="text-xs text-zinc-500 capitalize">{draw.draw_type} draw</p>
                </div>
                {draw.myEntry ? (
                  <div className="text-right">
                    {draw.myEntry.prize_tier && draw.myEntry.prize_tier !== 'none' ? (
                      <div>
                        <span className="inline-block bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-bold px-3 py-1 rounded-full">
                          🏆 Won! {formatCurrency(draw.myEntry.prize_amount)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-600">{draw.myEntry.match_count} numbers matched</span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-zinc-600">Not entered</span>
                )}
              </div>

              <div className="flex gap-3 mb-5">
                {(draw.numbers || []).map((n: number) => {
                  const isMatch = draw.myEntry && draw.myEntry.match_count > 0
                  return (
                    <div key={n} className="draw-number">{n}</div>
                  )
                })}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
                  <p className="text-xs text-zinc-500">Jackpot (5 match)</p>
                  <p className="font-bold text-yellow-400">{formatCurrency(draw.jackpot_amount)}</p>
                  {draw.rollover_amount > 0 && <p className="text-xs text-zinc-600">+{formatCurrency(draw.rollover_amount)} rollover</p>}
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
                  <p className="text-xs text-zinc-500">4-Match</p>
                  <p className="font-bold text-green-400">{formatCurrency(draw.pool_4match)}</p>
                </div>
                <div className="text-center p-3 bg-zinc-800/50 rounded-xl">
                  <p className="text-xs text-zinc-500">3-Match</p>
                  <p className="font-bold text-purple-400">{formatCurrency(draw.pool_3match)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
