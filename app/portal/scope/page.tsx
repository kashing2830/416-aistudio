import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ScopeClient from './ScopeClient'

export default async function ScopePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: project } = await supabase
    .from('projects').select('*').eq('client_id', user.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()

  if (!project) redirect('/portal/requirements')

  const { data: scope } = await supabase
    .from('scope_documents').select('*')
    .eq('project_id', project.id)
    .order('version', { ascending: false }).limit(1).maybeSingle()

  const { data: quote } = await supabase
    .from('quotes').select('*').eq('project_id', project.id).maybeSingle()

  return <ScopeClient project={project} scope={scope} quote={quote} userEmail={user.email ?? ''} />
}
