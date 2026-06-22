import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'

export default async function AdminReportsPage() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: activeUsers },
    { data: payments },
    { data: draws },
    { data: charityStats },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('subscription_payments').select('amount, charity_contribution, prize_pool_contribution, plan, created_at'),
    supabase.from('draws').select('total_pool, jackpot_amount, draw_month, status'),
    supabase.from('profiles').select('charity_percentage, charities(name)').not('selected_charity_id', 'is', null),
  ])

  const totalRevenue = (payments || []).reduce((s, p) => s + (p.amount || 0), 0)
  const totalCharity = (payments || []).reduce((s, p) => s + (p.charity_contribution || 0), 0)
  const totalPool = (payments || []).reduce((s, p) => s + (p.prize_pool_contribution || 0), 0)
  const totalDrawPool = (draws || []).reduce((s, d) => s + (d.total_pool || 0), 0)

  const monthlyCount = (payments || []).filter(p => p.plan === 'monthly').length
  const yearlyCount = (payments || []).filter(p => p.plan === 'yearly').length

  // Top charities
  const charityMap: Record<string, number> = {}
  ;(charityStats || []).forEach(p => {
    const name = (p as any).charities?.name
    if (name) charityMap[name] = (charityMap[name] || 0) + 1
  })
  const topCharities = Object.entries(charityMap).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Reports & Analytics</h1>
      <p className="text-zinc-400 mb-8">Platform performance overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: totalUsers || 0, color: 'text-white' },
          { label: 'Active Subscribers', value: activeUsers || 0, color: 'text-green-400' },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: 'text-blue-400' },
          { label: 'Charity Donated', value: formatCurrency(totalCharity), color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Subscription breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Subscription Split</h2>
          <div className="space-y-4">
            {[
              { label: 'Monthly Plans', count: monthlyCount, color: 'bg-green-500' },
              { label: 'Yearly Plans', count: yearlyCount, color: 'bg-purple-500' },
            ].map(s => {
              const total = monthlyCount + yearlyCount || 1
              const pct = Math.round((s.count / total) * 100)
              return (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-zinc-300">{s.label}</span>
                    <span className="text-zinc-500">{s.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 p-4 bg-zinc-800/50 rounded-xl">
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div><p className="text-zinc-500">Prize Pool</p><p className="font-bold text-yellow-400">{formatCurrency(totalDrawPool)}</p></div>
              <div><p className="text-zinc-500">Draws Run</p><p className="font-bold text-white">{draws?.filter(d => d.status === 'published').length || 0}</p></div>
              <div><p className="text-zinc-500">Avg Pool/Draw</p><p className="font-bold text-white">{draws?.length ? formatCurrency(totalDrawPool / draws.length) : '—'}</p></div>
            </div>
          </div>
        </div>

        {/* Top charities */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Top Charities by Supporters</h2>
          {topCharities.length > 0 ? (
            <div className="space-y-3">
              {topCharities.map(([name, count], i) => {
                const total = topCharities.reduce((s, [, c]) => s + c, 0) || 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-zinc-300">#{i+1} {name}</span>
                      <span className="text-zinc-500">{count} supporters</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No charity data yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
