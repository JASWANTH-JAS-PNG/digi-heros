import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { calculateMatches, getPrizeTier } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { drawId, numbers, jackpot, pool4, pool3 } = await req.json()
    const supabase = await createAdminClient()

    // Get all active subscribers with 5 scores
    const { data: users } = await supabase
      .from('profiles')
      .select('id')
      .eq('subscription_status', 'active')

    if (!users?.length) return NextResponse.json({ processed: 0 })

    const entries = []
    const winners: Record<string, string[]> = { '5-match': [], '4-match': [], '3-match': [] }

    for (const user of users) {
      const { data: scores } = await supabase
        .from('golf_scores')
        .select('score')
        .eq('user_id', user.id)
        .order('score_date', { ascending: false })
        .limit(5)

      if (!scores?.length) continue

      const userScores = scores.map(s => s.score)
      const matchCount = calculateMatches(userScores, numbers)
      const prizeTier = getPrizeTier(matchCount)

      entries.push({
        draw_id: drawId,
        user_id: user.id,
        scores: userScores,
        match_count: matchCount,
        prize_tier: prizeTier,
        prize_amount: 0,
      })

      if (prizeTier !== 'none') winners[prizeTier].push(user.id)
    }

    // Calculate prize amounts per winner
    const prizeMap: Record<string, number> = {}
    if (winners['5-match'].length > 0) {
      const each = jackpot / winners['5-match'].length
      winners['5-match'].forEach(id => { prizeMap[id] = each })
    }
    if (winners['4-match'].length > 0) {
      const each = pool4 / winners['4-match'].length
      winners['4-match'].forEach(id => { prizeMap[id] = each })
    }
    if (winners['3-match'].length > 0) {
      const each = pool3 / winners['3-match'].length
      winners['3-match'].forEach(id => { prizeMap[id] = each })
    }

    // Assign prize amounts and upsert
    const finalEntries = entries.map(e => ({
      ...e,
      prize_amount: prizeMap[e.user_id] || 0,
    }))

    if (finalEntries.length) {
      await supabase.from('draw_entries').upsert(finalEntries, { onConflict: 'draw_id,user_id' })

      // Create winner verifications for prize winners
      const winnerEntries = finalEntries.filter(e => e.prize_tier !== 'none')
      if (winnerEntries.length) {
        const { data: insertedEntries } = await supabase
          .from('draw_entries')
          .select('id, user_id')
          .eq('draw_id', drawId)
          .neq('prize_tier', 'none')

        if (insertedEntries?.length) {
          await supabase.from('winner_verifications').upsert(
            insertedEntries.map(e => ({
              draw_entry_id: e.id,
              user_id: e.user_id,
              status: 'pending',
              payment_status: 'pending',
            })),
            { onConflict: 'draw_entry_id' }
          )
        }
      }
    }

    return NextResponse.json({ processed: finalEntries.length, winners: Object.values(winners).flat().length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
