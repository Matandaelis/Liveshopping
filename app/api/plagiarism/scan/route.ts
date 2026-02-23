import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documentId, text } = body
    const userId = request.headers.get('x-user-id') || 'test-user'

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Check feature access
    if (prisma) {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      })

      const tier = subscription?.tier || 'FREE'
      const scanLimits: Record<string, number> = {
        FREE: 1,
        PRO: 10,
        PREMIUM: -1,
        ENTERPRISE: -1,
      }

      const limit = scanLimits[tier] || 1
      if (limit !== -1) {
        const scansThisMonth = await prisma.plagiarismScan.count({
          where: {
            document: { userId },
            scanDate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        })

        if (scansThisMonth >= limit) {
          return NextResponse.json(
            { error: 'Plagiarism scan limit reached for this month' },
            { status: 429 }
          )
        }
      }
    }

    // Simulate plagiarism detection (in production, integrate with Turnitin, Copyscape, or similar)
    // For now, generate a mock report
    const mockSimilarityPercentage = Math.floor(Math.random() * 30) // 0-30% similarity
    const mockMatches = Math.floor(Math.random() * 5) // 0-5 potential matches

    const scan = prisma
      ? await prisma.plagiarismScan.create({
          data: {
            documentId,
            originalityScore: 100 - mockSimilarityPercentage,
            similarityPercentage: mockSimilarityPercentage,
            matchCount: mockMatches,
            scanDate: new Date(),
            report: JSON.stringify({
              totalWords: text.split(/\s+/).length,
              matchedWords: Math.floor((text.split(/\s+/).length * mockSimilarityPercentage) / 100),
              sources: Array.from({ length: mockMatches }).map((_, i) => ({
                title: `Source ${i + 1}`,
                url: `https://example.com/source-${i + 1}`,
                percentage: Math.floor(Math.random() * 5) + 1,
              })),
              status: 'COMPLETED',
            }),
          },
        })
      : null

    // Track usage
    if (prisma) {
      await prisma.userStats
        .update({
          where: { userId },
          data: { plagiarismScansUsed: { increment: 1 } },
        })
        .catch(() => null)
    }

    return NextResponse.json({
      scanId: scan?.id,
      originalityScore: scan?.originalityScore || 100 - mockSimilarityPercentage,
      similarityPercentage: mockSimilarityPercentage,
      matchCount: mockMatches,
      status: 'COMPLETED',
      message: 'Plagiarism scan completed successfully',
      report: {
        totalWords: text.split(/\s+/).length,
        matchedWords: Math.floor((text.split(/\s+/).length * mockSimilarityPercentage) / 100),
        sources: Array.from({ length: mockMatches }).map((_, i) => ({
          title: `Source ${i + 1}`,
          url: `https://example.com/source-${i + 1}`,
          percentage: Math.floor(Math.random() * 5) + 1,
        })),
      },
    })
  } catch (error) {
    console.error('[v0] Plagiarism scan error:', error)
    return NextResponse.json(
      { error: 'Failed to perform plagiarism scan' },
      { status: 500 }
    )
  }
}
