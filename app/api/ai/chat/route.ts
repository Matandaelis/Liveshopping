import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, documentId, context = '' } = body
    const userId = request.headers.get('x-user-id') || 'test-user'

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build system prompt for academic writing assistant
    const systemPrompt = `You are an expert academic writing assistant for thesis and research papers. 
    You help with:
    - Grammar and clarity improvements
    - Structure and organization feedback
    - Citation and reference guidance
    - Argument strength assessment
    - Research methodology support
    
    Be concise, professional, and focused on improving academic writing quality.
    ${context ? `\nContext: ${context}` : ''}`

    // Generate response using Groq
    const { text: response } = await generateText({
      model: groq('mixtral-8x7b-32768'),
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
      maxTokens: 800,
    })

    // Save chat history if we have prisma
    if (prisma && documentId) {
      await prisma.aIChat
        .create({
          data: {
            userId,
            documentId,
            userMessage: message,
            assistantResponse: response,
          },
        })
        .catch(() => null)
    }

    return NextResponse.json({
      response: response.trim(),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[v0] AI chat error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
