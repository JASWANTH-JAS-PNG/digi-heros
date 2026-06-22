import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate, getCurrentMonth } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .eq('id', user.id)
    .single()

  const { data: scores } = await supabase
    .from('golf_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('score_date', { ascending: false })
    .limit(5)

  const { data: latestDraw } = await supabase
    .from('draws')
    .select('*, draw_entries(match_count, prize_tier, prize_amount)')
    .eq('status', 'published')
    .order('draw_month', { ascending: false })
    .limit(1)
    .single()

  const { data: winnings } = await supabase
    .from('draw_entries')
    .select('prize_amount, prize_tier, draws(draw_month)')
    .eq('user_id', user.id)
    .neq('prize_tier', 'none')

  const totalWon = (winnings || []).reduce((s, w) => s + (w.prize_amount || 0), 0)

  const isActive = profile?.subscription_status === 'active'

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Player'} 👋
          </h1>
          <p className="text-zinc-400 mt-1">Here's your GolfGive overview</p>
        </div>
        {!isActive && (
          <Link href="/api/subscriptions/checkout" className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
            Activate Subscription
          </Link>
        )}
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-xs text-zinc-500 mb-1">Subscription</p>
          <p className={`text-lg font-bold capitalize ${isActive ? 'text-green-400' : 'text-red-400'}`}>
            {profile?.subscription_status || 'inactive'}
          </p>
          <p className="text-xs text-zinc-600 mt-1">{profile?.subscription_plan || '—'}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-xs text-zinc-500 mb-1">Scores Logged</p>
          <p className="text-lg font-bold text-white">{scores?.length || 0}/5</p>
          <p className="text-xs text-zinc-600 mt-1">Rolling last 5</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-xs text-zinc-500 mb-1">Total Winnings</p>
          <p className="text-lg font-bold text-white">{formatCurrency(totalWon)}</p>
          <p className="text-xs text-zinc-600 mt-1">{winnings?.length || 0} prizes</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <p className="text-xs text-zinc-500 mb-1">Charity</p>
          <p className="text-lg font-bold text-white truncate">{(profile as any)?.charities?.name || 'Not set'}</p>
          <p className="text-xs text-zinc-600 mt-1">{profile?.charity_percentage}% contribution</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scores */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Your Last 5 Scores</h2>
            <Link href="/dashboard/scores" className="text-xs text-green-400 hover:text-green-300">Manage →</Link>
          </div>
          {scores && scores.length > 0 ? (
            <div className="space-y-3">
              {scores.map((s, i) => (
                <div key={s.id} className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-sm font-bold text-green-400">
                      {i + 1}
                    </div>
                    <span className="text-sm text-zinc-400">{formatDate(s.score_date)}</span>
                  </div>
                  <span className="text-xl font-black text-white">{s.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-sm mb-3">No scores logged yet</p>
              <Link href="/dashboard/scores" className="text-sm bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors">
                Add First Score
              </Link>
            </div>
          )}
        </div>

        {/* Latest draw */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Latest Draw</h2>
            <Link href="/dashboard/draws" className="text-xs text-green-400 hover:text-green-300">All Draws →</Link>
          </div>
          {latestDraw ? (
            <div>
              <div className="text-sm text-zinc-500 mb-4">Draw: {latestDraw.draw_month}</div>
              <div className="flex gap-3 mb-6">
                {(latestDraw.numbers || []).map((n: number) => (
                  <div key={n} className="draw-number">{n}</div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                  <p className="text-xs text-zinc-500">Jackpot</p>
                  <p className="font-bold text-yellow-400">{formatCurrency(latestDraw.jackpot_amount)}</p>
                </div>
                <div className="text-center p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                  <p className="text-xs text-zinc-500">4-Match</p>
                  <p className="font-bold text-green-400">{formatCurrency(latestDraw.pool_4match)}</p>
                </div>
                <div className="text-center p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                  <p className="text-xs text-zinc-500">3-Match</p>
                  <p className="font-bold text-purple-400">{formatCurrency(latestDraw.pool_3match)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-zinc-500 text-sm">No published draws yet</p>
              <p className="text-xs text-zinc-600 mt-1">Check back after the monthly draw</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
