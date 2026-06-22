'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function WinnerActions({ verificationId, status, paymentStatus }: {
  verificationId: string; status: string; paymentStatus: string
}) {
  const router = useRouter()
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function updateStatus(newStatus: string) {
    setLoading(true)
    await supabase.from('winner_verifications').update({
      status: newStatus,
      admin_notes: notes || null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', verificationId)
    router.refresh()
    setLoading(false)
  }

  async function markPaid() {
    setLoading(true)
    await supabase.from('winner_verifications').update({
      payment_status: 'paid',
      updated_at: new Date().toISOString(),
    }).eq('id', verificationId)
    router.refresh()
    setLoading(false)
  }

  if (status !== 'pending' && paymentStatus === 'paid') return null

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800">
      {status === 'pending' && (
        <>
          <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Admin notes (optional)"
            className="flex-1 min-w-48 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-green-500 transition-colors" />
          <button onClick={() => updateStatus('approved')} disabled={loading}
            className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 font-medium px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-50">
            ✓ Approve
          </button>
          <button onClick={() => updateStatus('rejected')} disabled={loading}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-50">
            ✗ Reject
          </button>
        </>
      )}
      {status === 'approved' && paymentStatus !== 'paid' && (
        <button onClick={markPaid} disabled={loading}
          className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 font-medium px-4 py-2 rounded-xl text-xs transition-colors disabled:opacity-50">
          💸 Mark as Paid
        </button>
      )}
    </div>
  )
}
