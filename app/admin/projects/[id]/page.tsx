import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminProjectClient from './AdminProjectClient'

export default async function AdminProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*, profiles!projects_client_id_fkey(email, full_name)')
    .eq('id', params.id)
    .single()

  if (!project) notFound()

  const [
    { data: requirements },
    { data: scopeDocs },
    { data: quotes },
    { data: payments },
    { data: designs },
    { data: milestones },
    { data: bugs },
    { data: delivery },
  ] = await Promise.all([
    supabase.from('requirements').select('*').eq('project_id', params.id).maybeSingle(),
    supabase.from('scope_documents').select('*').eq('project_id', params.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('quotes').select('*').eq('project_id', params.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('payments').select('*').eq('project_id', params.id).order('created_at', { ascending: false }),
    supabase.from('designs').select('*').eq('project_id', params.id).order('version', { ascending: false }).limit(1).maybeSingle(),
    supabase.from('milestones').select('*').eq('project_id', params.id).order('order', { ascending: true }),
    supabase.from('bugs').select('*').eq('project_id', params.id).order('created_at', { ascending: false }),
    supabase.from('deliveries').select('*').eq('project_id', params.id).maybeSingle(),
  ])

  return (
    <AdminProjectClient
      project={project}
      requirements={requirements ?? null}
      scopeDoc={scopeDocs ?? null}
      quote={quotes ?? null}
      payments={payments ?? []}
      design={designs ?? null}
      milestones={milestones ?? []}
      bugs={bugs ?? []}
      delivery={delivery ?? null}
    />
  )
}
