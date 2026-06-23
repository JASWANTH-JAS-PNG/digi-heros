import { createClient } from '@/lib/supabase/server'
import LandingClient from './_components/LandingClient'

const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url_here' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')

export default async function LandingPage() {
  let user = null
  let charities: any[] = []

  if (isSupabaseConfigured) {
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
      // ignore
    }
  }

  return <LandingClient user={user} charities={charities} />
}
