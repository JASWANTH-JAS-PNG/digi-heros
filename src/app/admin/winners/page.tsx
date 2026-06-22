import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import WinnerActions from './WinnerActions'

export default async function AdminWinnersPage() {
  const supabase = await createClient()
  const { data: verifications } = await supabase
    .from('winner_verifications')
    .select(`
      *,
      profiles(full_name, email),
      draw_entries(prize_tier, prize_amount, draws(draw_month))
    `)
    .order('created_at', { ascending: false })

  const pending = verifications?.filter(v => v.status === 'pending') || []
  const approved = verifications?.filter(v => v.status === 'approved') || []
  const paid = verifications?.filter(v => v.payment_status === 'paid') || []

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Winner Verifications</h1>
      <p className="text-zinc-400 mb-6">Review winner submissions and manage payouts.</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-orange-400">{pending.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Pending Review</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-green-400">{approved.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Approved</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
          <p className="text-2xl font-bold text-purple-400">{paid.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Paid Out</p>
        </div>
      </div>

      <div className="space-y-4">
        {(verifications || []).map(v => (
          <div key={v.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <p className="font-bold text-white">{(v as any).profiles?.full_name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    v.status === 'pending' ? 'bg-orange-500/10 text-orange-400' :
                    v.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{v.status}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${v.payment_status === 'paid' ? 'bg-purple-500/10 text-purple-400' : 'bg-zinc-700 text-zinc-500'}`}>
                    {v.payment_status}
                  </span>
                </div>
                <p className="text-sm text-zinc-400">{(v as any).profiles?.email}</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Draw: {(v as any).draw_entries?.draws?.draw_month} ·
                  Prize: <span className="text-green-400 font-medium">{formatCurrency((v as any).draw_entries?.prize_amount || 0)}</span> ·
                  {' '}<span className="capitalize">{(v as any).draw_entries?.prize_tier}</span>
                </p>
                <p className="text-xs text-zinc-600">Submitted: {formatDate(v.created_at)}</p>
                {v.admin_notes && <p className="text-xs text-zinc-500 mt-2 bg-zinc-800 px-3 py-2 rounded-lg">Note: {v.admin_notes}</p>}
              </div>
              {v.screenshot_url && (
                <a href={v.screenshot_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
                  📷 View Screenshot
                </a>
              )}
            </div>
            <WinnerActions verificationId={v.id} status={v.status} paymentStatus={v.payment_status} />
          </div>
        ))}
        {!verifications?.length && (
          <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">No winner verifications yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
