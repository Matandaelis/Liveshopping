import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'test-user'

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (!subscription) {
      return NextResponse.json({
        tier: 'FREE',
        status: 'ACTIVE',
        stripeCustomerId: null,
        currentPeriodEnd: null,
        renewalDate: null,
      })
    }

    return NextResponse.json({
      tier: subscription.tier,
      status: subscription.status,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      currentPeriodStart: subscription.currentPeriodStart?.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
      cancelledAt: subscription.cancelledAt?.toISOString(),
      createdAt: subscription.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('[v0] Get subscription error:', error)
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'test-user'
    const body = await request.json()

    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    const updated = await prisma.subscription.update({
      where: { userId },
      data: {
        tier: body.tier || subscription.tier,
        status: body.status || subscription.status,
      },
    })

    return NextResponse.json({
      tier: updated.tier,
      status: updated.status,
      message: `Subscription updated to ${updated.tier}`,
    })
  } catch (error) {
    console.error('[v0] Update subscription error:', error)
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
  }
}
