import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { handleStripeWebhook, getStripeWebhookSecret } from '@/lib/stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature found' }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret())

    await handleStripeWebhook(event)

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json({ error: `Webhook error: ${error.message}` }, { status: 400 })
  }
}

