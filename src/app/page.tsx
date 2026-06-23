import { createClient } from '@/lib/supabase/server'
import LandingClient from './_components/LandingClient'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .eq('is_active', true)
    .limit(4)

  return <LandingClient user={user} charities={charities || []} />
}
