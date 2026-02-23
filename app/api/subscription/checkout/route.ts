import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = request.headers.get('x-user-id') || 'test-user'
    const { tier = 'PRO' } = body

    // Get or create user subscription
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (!subscription) {
      // User doesn't have a subscription, create one
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      subscription = await prisma.subscription.create({
        data: {
          userId,
          tier: 'FREE',
          status: 'ACTIVE',
        },
      })
    }

    // Create checkout session
    const sessionId = await createCheckoutSession(userId, tier)

    return NextResponse.json({
      sessionId,
      url: `https://checkout.stripe.com/pay/${sessionId}`,
    })
  } catch (error) {
    console.error('[v0] Checkout session error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
