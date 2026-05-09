import { createClient } from '@/lib/supabase/server'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('projects')
    .select('*, profiles!projects_client_id_fkey(email, full_name)')
    .order('created_at', { ascending: false })

  const { data: payments } = await supabase
    .from('payments').select('*').eq('status', 'pending')

  const { data: bugs } = await supabase
    .from('bugs').select('*').neq('status', 'fixed')

  const { data: notifications } = await supabase
    .from('notifications').select('*').eq('read', false).order('created_at', { ascending: false }).limit(20)

  return (
    <AdminDashboardClient
      projects={projects ?? []}
      pendingPayments={payments ?? []}
      openBugs={bugs ?? []}
      notifications={notifications ?? []}
      userEmail={user?.email ?? ''}
    />
  )
}
