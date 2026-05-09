import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UATClient from './UATClient'

export default async function UATPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: project } = await supabase
    .from('projects').select('*').eq('client_id', user.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()

  if (!project) redirect('/portal/requirements')

  const { data: bugs } = await supabase
    .from('bugs').select('*').eq('project_id', project.id)
    .order('created_at', { ascending: false })

  const { data: delivery } = await supabase
    .from('deliveries').select('staging_url, delivered_at').eq('project_id', project.id).maybeSingle()

  return <UATClient project={project} bugs={bugs ?? []} stagingUrl={delivery?.staging_url ?? null} deliveredAt={delivery?.delivered_at ?? null} userEmail={user.email ?? ''} />
}
