import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: activeUsers },
    { data: draws },
    { data: recentWinners },
    { data: payments },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('draws').select('total_pool, jackpot_amount').eq('status', 'published'),
    supabase.from('winner_verifications').select('*, profiles(full_name, email), draw_entries(prize_tier, prize_amount)').eq('status', 'pending').limit(5),
    supabase.from('subscription_payments').select('amount, charity_contribution, prize_pool_contribution'),
  ])

  const totalPool = (draws || []).reduce((s, d) => s + (d.total_pool || 0), 0)
  const totalCharity = (payments || []).reduce((s, p) => s + (p.charity_contribution || 0), 0)
  const totalRevenue = (payments || []).reduce((s, p) => s + (p.amount || 0), 0)

  const stats = [
    { label: 'Total Users', value: totalUsers || 0, link: '/admin/users', color: 'text-white' },
    { label: 'Active Subscribers', value: activeUsers || 0, link: '/admin/users', color: 'text-green-400' },
    { label: 'Total Prize Pools', value: formatCurrency(totalPool), link: '/admin/draws', color: 'text-yellow-400' },
    { label: 'Total Charity Given', value: formatCurrency(totalCharity), link: '/admin/reports', color: 'text-purple-400' },
    { label: 'Pending Verifications', value: recentWinners?.length || 0, link: '/admin/winners', color: 'text-orange-400' },
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), link: '/admin/reports', color: 'text-blue-400' },
  ]

  const quickLinks = [
    { href: '/admin/draws', icon: '🎯', label: 'Run Draw', desc: 'Configure and publish monthly draws' },
    { href: '/admin/users', icon: '👥', label: 'Manage Users', desc: 'View and edit user accounts' },
    { href: '/admin/charities', icon: '❤️', label: 'Charities', desc: 'Add or update charity listings' },
    { href: '/admin/winners', icon: '🏆', label: 'Verify Winners', desc: 'Review and approve winner claims' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
        <p className="text-zinc-400 mt-1">Platform overview and controls</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <Link key={s.label} href={s.link} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
            <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map(l => (
          <Link key={l.href} href={l.href} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-green-500/30 transition-all group">
            <div className="text-3xl mb-3">{l.icon}</div>
            <h3 className="font-bold text-white group-hover:text-green-400 transition-colors">{l.label}</h3>
            <p className="text-xs text-zinc-500 mt-1">{l.desc}</p>
          </Link>
        ))}
      </div>

      {recentWinners && recentWinners.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Pending Winner Verifications</h2>
            <Link href="/admin/winners" className="text-xs text-green-400 hover:text-green-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentWinners.map((w: any) => (
              <div key={w.id} className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-3">
                <div>
                  <p className="font-medium text-white text-sm">{w.profiles?.full_name}</p>
                  <p className="text-xs text-zinc-500">{w.profiles?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">{formatCurrency(w.draw_entries?.prize_amount || 0)}</p>
                  <p className="text-xs text-zinc-500 capitalize">{w.draw_entries?.prize_tier}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
