import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'test-user'
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 })
    }

    // Verify document belongs to user
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Get all citations for document
    const citations = await prisma.citation.findMany({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      citations: citations.map((c) => ({
        ...c,
        authors: typeof c.authors === 'string' ? JSON.parse(c.authors) : c.authors,
        createdAt: c.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('[v0] Get citations error:', error)
    return NextResponse.json({ error: 'Failed to fetch citations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = request.headers.get('x-user-id') || 'test-user'
    const { documentId, title, authors, year, publicationTitle, citationStyle = 'APA' } = body

    if (!documentId || !title) {
      return NextResponse.json({ error: 'Document ID and title required' }, { status: 400 })
    }

    // Verify document
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Create citation
    const citation = await prisma.citation.create({
      data: {
        userId,
        documentId,
        title,
        authors: JSON.stringify(authors || []),
        year: year ? parseInt(year) : null,
        publicationTitle,
        citationStyle,
      },
    })

    return NextResponse.json({
      ...citation,
      authors: authors || [],
      createdAt: citation.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('[v0] Create citation error:', error)
    return NextResponse.json({ error: 'Failed to create citation' }, { status: 500 })
  }
}
