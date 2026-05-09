import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPaymentIntent } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId, amount, type } = await req.json()

  if (!projectId || !amount || !type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Insert pending payment record
  const { data: payment } = await supabase.from('payments').insert({
    project_id: projectId,
    amount,
    type,
    method: 'stripe',
    status: 'pending',
  }).select().single()

  // Create Stripe payment intent (amount is already in HKD)
  const { clientSecret } = await createPaymentIntent(amount, {
    projectId,
    paymentId: payment?.id ?? '',
    type,
  })

  return NextResponse.json({ clientSecret })
}
