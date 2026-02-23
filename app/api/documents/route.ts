import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get current user from session or auth header
    const userId = request.headers.get('x-user-id') || 'test-user'

    const documents = await prisma.document.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        status: true,
        wordCount: true,
        updatedAt: true,
        templateId: true,
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      documents: documents.map((doc) => ({
        ...doc,
        updatedAt: doc.updatedAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('[v0] GET /api/documents error:', error)
    return NextResponse.json({ documents: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const userId = request.headers.get('x-user-id') || 'test-user'

    const document = await prisma.document.create({
      data: {
        userId,
        title: body.title || 'Untitled Document',
        content: body.content || [],
        status: 'DRAFT',
        wordCount: 0,
        templateId: body.templateId || null,
      },
    })

    return NextResponse.json({
      id: document.id,
      title: document.title,
      status: document.status,
      wordCount: document.wordCount,
      updatedAt: document.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('[v0] POST /api/documents error:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

