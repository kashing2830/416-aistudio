import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DeliveryClient from './DeliveryClient'

export default async function DeliveryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: project } = await supabase
    .from('projects').select('*').eq('client_id', user.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()

  if (!project) redirect('/portal/requirements')

  const { data: delivery } = await supabase
    .from('deliveries').select('*').eq('project_id', project.id).maybeSingle()

  const { data: payments } = await supabase
    .from('payments').select('*').eq('project_id', project.id).eq('status', 'confirmed')

  const { data: bugs } = await supabase
    .from('bugs').select('*').eq('project_id', project.id)

  const confirmedTotal = (payments ?? []).reduce((s, p) => s + p.amount, 0)

  return (
    <DeliveryClient
      project={project}
      delivery={delivery ?? null}
      confirmedTotal={confirmedTotal}
      bugCount={(bugs ?? []).length}
      openBugCount={(bugs ?? []).filter(b => b.status !== 'fixed').length}
      userEmail={user.email ?? ''}
    />
  )
}
