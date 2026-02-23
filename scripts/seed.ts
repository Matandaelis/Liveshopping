import { prisma } from '@/lib/db'

async function seed() {
  console.log('[v0] Starting database seed...')

  try {
    // Create test user
    const testUserId = 'test-user-001'

    // Create subscription for test user
    await prisma.subscription.upsert({
      where: { userId: testUserId },
      update: { tier: 'PRO', status: 'ACTIVE' },
      create: {
        userId: testUserId,
        tier: 'PRO',
        status: 'ACTIVE',
      },
    })

    console.log('[v0] Created subscription')

    // Create analytics for test user
    await prisma.userAnalytics.upsert({
      where: { userId: testUserId },
      update: {},
      create: {
        userId: testUserId,
        totalDocumentsCreated: 2,
        totalWordsWritten: 5700,
        totalTimeSpent: 120,
      },
    })

    console.log('[v0] Created user analytics')

    // Create AI usage stats
    await prisma.aIUsageStats.upsert({
      where: { userId: testUserId },
      update: {},
      create: {
        userId: testUserId,
        suggestionsUsedToday: 12,
        scansUsedToday: 1,
        totalSuggestions: 87,
        totalScans: 8,
      },
    })

    console.log('[v0] Created AI usage stats')

    // Create sample documents
    const doc1 = await prisma.document.create({
      data: {
        userId: testUserId,
        title: 'Chapter 1: Introduction to Machine Learning',
        content: JSON.stringify([
          {
            type: 'heading',
            content: 'Introduction to Machine Learning',
          },
          {
            type: 'paragraph',
            content:
              'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. This chapter introduces the fundamental concepts and principles that underpin the field of machine learning.',
          },
        ]),
        wordCount: 2500,
        status: 'DRAFT',
      },
    })

    const doc2 = await prisma.document.create({
      data: {
        userId: testUserId,
        title: 'Chapter 2: Neural Networks',
        content: JSON.stringify([
          {
            type: 'heading',
            content: 'Neural Networks and Deep Learning',
          },
          {
            type: 'paragraph',
            content:
              'Neural networks are computing systems inspired by biological neural networks that constitute animal brains. They are the foundation of deep learning, a subset of machine learning that uses multiple layers of artificial neurons.',
          },
        ]),
        wordCount: 3200,
        status: 'IN_PROGRESS',
      },
    })

    console.log('[v0] Created sample documents')

    // Create sample citations
    await prisma.citation.create({
      data: {
        userId: testUserId,
        documentId: doc1.id,
        title: 'Machine Learning: A Probabilistic Perspective',
        authors: JSON.stringify(['Kevin P. Murphy']),
        year: 2012,
        publicationTitle: 'MIT Press',
        citationStyle: 'APA',
      },
    })

    await prisma.citation.create({
      data: {
        userId: testUserId,
        documentId: doc1.id,
        title: 'Deep Learning',
        authors: JSON.stringify(['Ian Goodfellow', 'Yoshua Bengio', 'Aaron Courville']),
        year: 2016,
        publicationTitle: 'MIT Press',
        citationStyle: 'APA',
      },
    })

    console.log('[v0] Created sample citations')

    // Create plagiarism scan
    await prisma.plagiarismScan.create({
      data: {
        documentId: doc1.id,
        status: 'COMPLETED',
        similarityPercentage: 12.5,
        scanDate: new Date(),
        flaggedSections: JSON.stringify([
          {
            text: 'Machine learning is a subset of artificial intelligence',
            similarity: 8.2,
          },
        ]),
      },
    })

    console.log('[v0] Created plagiarism scan')

    console.log('[v0] ✅ Database seed completed successfully!')
  } catch (error) {
    console.error('[v0] Seed error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
