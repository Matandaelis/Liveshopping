import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { text, type = 'improve', documentId } = await req.json()
    const userId = req.headers.get('x-user-id') || 'test-user'

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (text.length > 5000) {
      return NextResponse.json({ error: 'Text too long (max 5000 characters)' }, { status: 400 })
    }

    // Check usage limits
    const stats = await prisma.aIUsageStats.findUnique({
      where: { userId },
    })

    const tier = (await prisma.subscription.findUnique({ where: { userId } }))?.tier || 'FREE'
    const limits: Record<string, number> = {
      FREE: 50,
      PRO: 500,
      PREMIUM: 5000,
      ENTERPRISE: 999999,
    }

    if (stats && stats.suggestionsUsedToday >= (limits[tier] || 50)) {
      return NextResponse.json({ error: 'Daily suggestion limit reached' }, { status: 429 })
    }

    // Generate suggestion using Groq
    const prompts: Record<string, string> = {
      improve: `Improve this academic text for clarity, tone, and professionalism: "${text}". Return only the improved text.`,
      paraphrase: `Rephrase this academic text with different wording: "${text}". Return only the rephrased text.`,
      expand: `Expand this academic text with more detail and supporting points: "${text}". Return only the expanded text.`,
      grammar: `Fix all grammar, spelling, and punctuation errors: "${text}". Return only the corrected text.`,
      summarize: `Summarize this academic text in 1-2 sentences: "${text}". Return only the summary.`,
    }

    const { text: suggestion } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      prompt: prompts[type] || prompts.improve,
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Track usage
    await prisma.aIUsageStats.upsert({
      where: { userId },
      update: {
        suggestionsUsedToday: { increment: 1 },
        totalSuggestions: { increment: 1 },
      },
      create: {
        userId,
        suggestionsUsedToday: 1,
        totalSuggestions: 1,
      },
    })

    // Save feedback if documentId provided
    if (documentId) {
      await prisma.writingFeedback.create({
        data: {
          userId,
          documentId,
          type: type as any,
          text: text.substring(0, 100),
          suggestion: suggestion.trim().substring(0, 500),
          severity: 'low',
          characterStart: 0,
          characterEnd: text.length,
        },
      })
    }

    return NextResponse.json({
      original: text,
      suggestion: suggestion.trim(),
      type,
      usageRemaining: (limits[tier] || 50) - ((stats?.suggestionsUsedToday || 0) + 1),
    })
  } catch (error) {
    console.error('[v0] AI suggestion error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions', message: String(error) },
      { status: 500 }
    )
  }
}

