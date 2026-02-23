import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const userId = request.headers.get('x-user-id') || 'test-user'

    const document = await prisma.document.findFirst({
      where: { id, userId },
      include: {
        citations: true,
        plagiarismScans: true,
      },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...document,
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString(),
      citations: document.citations.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
      plagiarismScans: document.plagiarismScans.map((s) => ({
        ...s,
        scanDate: s.scanDate?.toISOString(),
        createdAt: s.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('[v0] GET /api/documents/:id error:', error)
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const userId = request.headers.get('x-user-id') || 'test-user'
    const body = await request.json()

    const document = await prisma.document.findFirst({
      where: { id, userId },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const updated = await prisma.document.update({
      where: { id },
      data: {
        title: body.title || document.title,
        content: body.content || document.content,
        wordCount: body.wordCount || 0,
        status: body.status || document.status,
      },
    })

    return NextResponse.json({
      id: updated.id,
      title: updated.title,
      status: updated.status,
      wordCount: updated.wordCount,
      updatedAt: updated.updatedAt.toISOString(),
      message: 'Document saved successfully',
    })
  } catch (error) {
    console.error('[v0] PUT /api/documents/:id error:', error)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    const userId = request.headers.get('x-user-id') || 'test-user'

    const document = await prisma.document.findFirst({
      where: { id, userId },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    await prisma.document.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] DELETE /api/documents/:id error:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}

