import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as { metadata: Record<string, string>; amount: number }
    const { paymentId, projectId, type } = pi.metadata
    if (!paymentId || !projectId) return NextResponse.json({ ok: true })

    const supabase = createServiceClient()
    await supabase.from('payments').update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    }).eq('id', paymentId)

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'payment_confirmed', projectId, amount: pi.amount / 100, paymentType: type }),
    })
  }

  return NextResponse.json({ ok: true })
}
