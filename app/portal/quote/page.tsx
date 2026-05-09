import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import QuoteClient from './QuoteClient'

export default async function QuotePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: project } = await supabase
    .from('projects').select('*').eq('client_id', user.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle()

  if (!project) redirect('/portal/requirements')

  const { data: quote } = await supabase
    .from('quotes').select('*').eq('project_id', project.id).maybeSingle()

  return <QuoteClient project={project} quote={quote} userEmail={user.email ?? ''} />
}
