import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export async function createPaymentIntent(amountHKD: number, metadata: Record<string, string>) {
  const pi = await stripe.paymentIntents.create({
    amount: amountHKD * 100,
    currency: 'hkd',
    metadata,
    automatic_payment_methods: { enabled: true },
  })
  return { clientSecret: pi.client_secret, id: pi.id }
}
