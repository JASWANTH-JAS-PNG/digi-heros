import { createClient } from '@/lib/supabase/server'
import LandingClient from './_components/LandingClient'

export default async function LandingPage() {
  let user = null
  let charities: any[] = []

  try {
    const supabase = await createClient()
    const { data: { user: u } } = await supabase.auth.getUser()
    user = u

    const { data } = await supabase
      .from('charities')
      .select('*')
      .eq('is_active', true)
      .limit(4)
    charities = data || []
  } catch {
    // Supabase not configured yet — show landing with empty data
  }

  return <LandingClient user={user} charities={charities} />
}
