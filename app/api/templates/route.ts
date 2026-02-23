import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const university = searchParams.get('university')

    let query: any = { isPublic: true }
    if (university) {
      query.university = university
    }

    const templates = await prisma.thesisTemplate.findMany({
      where: query,
      select: {
        id: true,
        name: true,
        university: true,
        description: true,
        sections: true,
        fontSettings: true,
        marginSettings: true,
      },
    })

    return NextResponse.json({
      templates: templates.map((t) => ({
        ...t,
        sections: typeof t.sections === 'string' ? JSON.parse(t.sections) : t.sections,
        fontSettings: typeof t.fontSettings === 'string' ? JSON.parse(t.fontSettings) : t.fontSettings,
        marginSettings: typeof t.marginSettings === 'string' ? JSON.parse(t.marginSettings) : t.marginSettings,
      })),
    })
  } catch (error) {
    console.error('[v0] Get templates error:', error)
    return NextResponse.json({ templates: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, university, description, sections, fontSettings, marginSettings } = body

    const template = await prisma.thesisTemplate.create({
      data: {
        name,
        university: university || 'Other',
        description,
        sections: JSON.stringify(sections || []),
        fontSettings: JSON.stringify(fontSettings || {}),
        marginSettings: JSON.stringify(marginSettings || {}),
      },
    })

    return NextResponse.json({
      ...template,
      sections: sections || [],
      fontSettings: fontSettings || {},
      marginSettings: marginSettings || {},
    })
  } catch (error) {
    console.error('[v0] Create template error:', error)
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 })
  }
}
