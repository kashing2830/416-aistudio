import { createClient } from '@/lib/supabase/server'
import AdminPaymentsClient from './AdminPaymentsClient'

export default async function AdminPaymentsPage() {
  const supabase = await createClient()

  const { data: payments } = await supabase
    .from('payments')
    .select('*, projects(name, client_id, profiles!projects_client_id_fkey(email))')
    .order('created_at', { ascending: false })

  return <AdminPaymentsClient payments={payments ?? []} />
}
