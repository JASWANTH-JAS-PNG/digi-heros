import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Users</h1>
      <p className="text-zinc-400 mb-6">{users?.length || 0} registered users</p>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3">Plan</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3">Charity</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3">Role</th>
                <th className="text-left text-xs font-medium text-zinc-500 px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map(u => (
                <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white text-sm">{u.full_name || '—'}</p>
                    <p className="text-xs text-zinc-500">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-300 capitalize">{u.subscription_plan || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                      u.subscription_status === 'active' ? 'bg-green-500/10 text-green-400' :
                      u.subscription_status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                      'bg-zinc-700 text-zinc-400'
                    }`}>
                      {u.subscription_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-400">{(u as any).charities?.name || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-zinc-700 text-zinc-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-500">{formatDate(u.created_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
