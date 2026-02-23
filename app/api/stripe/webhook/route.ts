import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    if (!webhookSecret) {
      console.warn('[v0] STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ received: true })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
      console.error('[v0] Webhook signature verification failed:', error)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log(`[v0] Stripe event: ${event.type}`)

    if (!prisma) {
      console.warn('[v0] Prisma not available for webhook processing')
      return NextResponse.json({ received: true })
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const planId = (subscription.items.data[0]?.price.id || '') as string

        // Find user by Stripe customer ID
        const user = await prisma.user.findFirst({
          where: { subscription: { stripeCustomerId: customerId } },
        })

        if (user) {
          // Determine tier from plan ID
          const tier = planId.includes('pro')
            ? 'PRO'
            : planId.includes('premium')
              ? 'PREMIUM'
              : 'FREE'

          // Update subscription
          await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
              tier,
              status: 'ACTIVE',
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              stripeSubscriptionId: subscription.id,
            },
            create: {
              userId: user.id,
              tier,
              status: 'ACTIVE',
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          })

          // Update user tier
          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionTier: tier },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user and mark subscription as cancelled
        const user = await prisma.user.findFirst({
          where: { subscription: { stripeCustomerId: customerId } },
        })

        if (user) {
          await prisma.subscription.update({
            where: { userId: user.id },
            data: {
              status: 'CANCELED',
              cancelledAt: new Date(),
              tier: 'FREE',
            },
          })

          await prisma.user.update({
            where: { id: user.id },
            data: { subscriptionTier: 'FREE' },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Log successful payment
        console.log(`[v0] Payment succeeded for customer ${customerId}`)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user and mark subscription as past due
        const user = await prisma.user.findFirst({
          where: { subscription: { stripeCustomerId: customerId } },
        })

        if (user) {
          await prisma.subscription.update({
            where: { userId: user.id },
            data: { status: 'PAST_DUE' },
          })
        }

        console.log(`[v0] Payment failed for customer ${customerId}`)
        break
      }

      default:
        console.log(`[v0] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
