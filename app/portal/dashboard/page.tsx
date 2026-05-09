import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ClientDashboard from './ClientDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*, profiles(full_name, email)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: quote } = project ? await supabase
    .from('quotes')
    .select('*')
    .eq('project_id', project.id)
    .maybeSingle() : { data: null }

  const { data: payments } = project ? await supabase
    .from('payments')
    .select('*')
    .eq('project_id', project.id)
    .eq('status', 'confirmed') : { data: null }

  const paidTotal = payments?.reduce((s: number, p: { amount: number }) => s + p.amount, 0) ?? 0

  return (
    <ClientDashboard
      project={project}
      quote={quote}
      paidTotal={paidTotal}
      notifications={notifications ?? []}
      userEmail={user.email ?? ''}
    />
  )
}
