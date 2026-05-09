import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProgressClient from './ProgressClient'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: project } = await supabase
    .from('projects').select('*').eq('client_id', user.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()

  if (!project) redirect('/portal/requirements')

  const { data: milestones } = await supabase
    .from('milestones').select('*').eq('project_id', project.id)
    .order('order', { ascending: true })

  return <ProgressClient project={project} milestones={milestones ?? []} userEmail={user.email ?? ''} />
}
