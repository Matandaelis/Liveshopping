import { NextRequest, NextResponse } from 'next/server'
import { checkPlagiarism, analyzeTextPatterns } from '@/lib/plagiarism'

export async function POST(req: NextRequest) {
  try {
    const { text, documentId } = await req.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Check word count (plagiarism checks usually have limits)
    const wordCount = text.split(/\s+/).length
    if (wordCount < 50) {
      return NextResponse.json(
        { error: 'Minimum 50 words required for plagiarism check' },
        { status: 400 }
      )
    }

    if (wordCount > 50000) {
      return NextResponse.json(
        { error: 'Maximum 50000 words allowed per check' },
        { status: 400 }
      )
    }

    // Run plagiarism check
    const [plagiarismResult, patternAnalysis] = await Promise.all([
      checkPlagiarism(text),
      Promise.resolve(analyzeTextPatterns(text)),
    ])

    // Save result to database (if needed)
    if (documentId) {
      console.log(`[v0] Plagiarism check for document ${documentId}: ${plagiarismResult.score}%`)
    }

    return NextResponse.json({
      score: plagiarismResult.score,
      flaggedSections: plagiarismResult.flaggedSections,
      summary: plagiarismResult.summary,
      patterns: patternAnalysis.patterns,
      risk: patternAnalysis.risk,
      timestamp: plagiarismResult.timestamp,
      wordCount,
    })
  } catch (error) {
    console.error('[v0] Plagiarism check error:', error)
    return NextResponse.json(
      { error: 'Failed to check plagiarism' },
      { status: 500 }
    )
  }
}
