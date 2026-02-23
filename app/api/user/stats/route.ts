import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { SUBSCRIPTION_FEATURES } from '@/lib/subscriptions'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'test-user'

    // Get user subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    const tier = (subscription?.tier || 'FREE') as keyof typeof SUBSCRIPTION_FEATURES
    const features = SUBSCRIPTION_FEATURES[tier]

    // Get user stats
    const analytics = await prisma.userAnalytics.findUnique({
      where: { userId },
    })

    // Count remaining documents
    const docCount = await prisma.document.count({
      where: { userId },
    })

    const documentsRemaining =
      features.maxDocuments === -1 ? 999 : Math.max(0, features.maxDocuments - docCount)

    return NextResponse.json({
      totalDocuments: docCount,
      totalWords: analytics?.totalWordsWritten || 0,
      subscriptionTier: tier,
      documentsRemaining,
      createdAt: analytics?.createdAt || new Date(),
    })
  } catch (error) {
    console.error('[v0] GET /api/user/stats error:', error)

    // Return defaults if database fails
    return NextResponse.json({
      totalDocuments: 0,
      totalWords: 0,
      subscriptionTier: 'FREE',
      documentsRemaining: 3,
    })
  }
}
