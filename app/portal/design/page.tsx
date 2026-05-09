import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DesignClient from './DesignClient'

export default async function DesignPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: project } = await supabase
    .from('projects').select('*').eq('client_id', user.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()

  if (!project) redirect('/portal/requirements')

  const { data: design } = await supabase
    .from('designs').select('*').eq('project_id', project.id)
    .order('version', { ascending: false }).limit(1).maybeSingle()

  return <DesignClient project={project} design={design} userEmail={user.email ?? ''} />
}
