import { NextRequest, NextResponse } from 'next/server'
import { generateWritingSuggestion, generateBulkSuggestions } from '@/lib/ai-suggestions'

export async function POST(req: NextRequest) {
  try {
    const { text, type = 'improve', bulk = false } = await req.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text too long (max 5000 characters)' },
        { status: 400 }
      )
    }

    let suggestions
    if (bulk) {
      suggestions = await generateBulkSuggestions(text, ['improve', 'grammarCheck', 'paraphrase'])
    } else {
      const suggestion = await generateWritingSuggestion(text, type)
      suggestions = suggestion ? [suggestion] : []
    }

    if (suggestions.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate suggestions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
