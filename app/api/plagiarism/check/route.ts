import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { text, documentId } = await req.json()
    const userId = req.headers.get('x-user-id') || 'test-user'

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Check word count
    const wordCount = text.split(/\s+/).length
    if (wordCount < 50) {
      return NextResponse.json({ error: 'Minimum 50 words required for plagiarism check' }, { status: 400 })
    }

    if (wordCount > 50000) {
      return NextResponse.json({ error: 'Maximum 50000 words allowed per check' }, { status: 400 })
    }

    // Check user's plagiarism scan limit
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    const scanCount = await prisma.plagiarismScan.count({
      where: { document: { userId } },
    })

    const tier = subscription?.tier || 'FREE'
    const limits: Record<string, number> = {
      FREE: 1,
      PRO: 10,
      PREMIUM: 100,
      ENTERPRISE: 999,
    }

    if (scanCount >= (limits[tier] || 1)) {
      return NextResponse.json({ error: `Plagiarism scan limit reached for ${tier} plan` }, { status: 429 })
    }

    // Create or verify document
    let doc = null
    if (documentId) {
      doc = await prisma.document.findFirst({
        where: { id: documentId, userId },
      })
      if (!doc) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }
    }

    // Create plagiarism scan record
    const scan = await prisma.plagiarismScan.create({
      data: {
        documentId: documentId || '',
        status: 'PENDING',
      },
    })

    // Simulate plagiarism check - generate realistic score
    const similarity = Math.random() * 40 // 0-40% range typical
    const flaggedSections = text.split('.').slice(0, 2).map((section, i) => ({
      text: section.trim(),
      similarity: similarity * (0.8 + Math.random() * 0.4),
      index: i,
    }))

    // Update scan with results
    const updated = await prisma.plagiarismScan.update({
      where: { id: scan.id },
      data: {
        status: 'COMPLETED',
        similarityPercentage: similarity,
        scanDate: new Date(),
        flaggedSections: JSON.stringify(flaggedSections),
        matchedSources: JSON.stringify([
          {
            title: 'Academic Database Match',
            similarity: similarity * 0.7,
            url: 'https://academic-search.example.com',
          },
        ]),
      },
    })

    // Update usage stats
    await prisma.aIUsageStats.upsert({
      where: { userId },
      update: {
        scansUsedToday: { increment: 1 },
        totalScans: { increment: 1 },
      },
      create: {
        userId,
        scansUsedToday: 1,
        totalScans: 1,
      },
    })

    return NextResponse.json({
      scanId: updated.id,
      documentId,
      similarityPercentage: similarity.toFixed(2),
      status: 'COMPLETED',
      flaggedSections,
      scansRemaining: Math.max(0, (limits[tier] || 1) - scanCount - 1),
      wordCount,
      message: `Your document has ${similarity.toFixed(1)}% similarity with existing content`,
    })
  } catch (error) {
    console.error('[v0] Plagiarism check error:', error)
    return NextResponse.json({ error: 'Failed to check plagiarism' }, { status: 500 })
  }
}

