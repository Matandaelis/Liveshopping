import { generateText } from 'ai'
import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface WritingSuggestion {
  type: 'improve' | 'paraphrase' | 'expand' | 'summarize' | 'grammarCheck'
  original: string
  suggestion: string
  explanation: string
  confidence: number
}

export async function generateWritingSuggestion(
  text: string,
  type: WritingSuggestion['type'] = 'improve'
): Promise<WritingSuggestion | null> {
  try {
    const prompts = {
      improve: `Improve the following academic text for clarity and impact. Return JSON with: {"suggestion": "improved text", "explanation": "why this is better", "confidence": 0.0-1.0}.\n\nText: "${text}"`,
      paraphrase: `Paraphrase this academic text with different wording while maintaining meaning. Return JSON with: {"suggestion": "paraphrased text", "explanation": "key changes", "confidence": 0.0-1.0}.\n\nText: "${text}"`,
      expand: `Expand this text with more detail and examples while maintaining academic tone. Return JSON with: {"suggestion": "expanded text", "explanation": "what was added", "confidence": 0.0-1.0}.\n\nText: "${text}"`,
      summarize: `Summarize this academic text concisely. Return JSON with: {"suggestion": "summary", "explanation": "key points retained", "confidence": 0.0-1.0}.\n\nText: "${text}"`,
      grammarCheck: `Check and fix grammar in this academic text. Return JSON with: {"suggestion": "corrected text", "explanation": "errors found", "confidence": 0.0-1.0}.\n\nText: "${text}"`,
    }

    const { text: response } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: prompts[type],
      temperature: 0.7,
      maxTokens: 500,
    })

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('[v0] Failed to parse Groq response as JSON')
      return null
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      type,
      original: text,
      suggestion: parsed.suggestion || '',
      explanation: parsed.explanation || '',
      confidence: Math.min(Math.max(parsed.confidence || 0.8, 0), 1),
    }
  } catch (error) {
    console.error('[v0] AI suggestion failed:', error)
    return null
  }
}

export async function generateBulkSuggestions(
  text: string,
  types: WritingSuggestion['type'][] = ['improve', 'grammarCheck']
): Promise<WritingSuggestion[]> {
  const suggestions = await Promise.all(
    types.map((type) => generateWritingSuggestion(text, type))
  )
  return suggestions.filter((s): s is WritingSuggestion => s !== null)
}
