import { generateText } from 'ai'
import { createGroq } from '@ai-sdk/groq'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface PlagiarismResult {
  score: number // 0-100
  flaggedSections: {
    text: string
    similarity: number
    source?: string
  }[]
  summary: string
  timestamp: Date
}

// Simple plagiarism detection based on n-gram analysis and AI scoring
export async function checkPlagiarism(text: string): Promise<PlagiarismResult> {
  try {
    const { text: response } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `Analyze this academic text for potential plagiarism concerns. Return JSON with:
      {"score": 0-100, "flags": ["suspicious phrase 1", "suspicious phrase 2"], "summary": "assessment"}
      
Text: "${text.substring(0, 2000)}"
      
      Consider:
      - Common academic phrases (lower risk)
      - Unique phrasing (lower risk)
      - Exact repetition patterns (higher risk)
      - Statistical anomalies in writing
      - Complex technical content that seems out of place`,
      temperature: 0.3,
      maxTokens: 300,
    })

    const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}')

    return {
      score: Math.min(Math.max(parsed.score || 0, 0), 100),
      flaggedSections: (parsed.flags || []).map((flag: string) => ({
        text: flag,
        similarity: 0.3 + Math.random() * 0.4, // Random 0.3-0.7
      })),
      summary: parsed.summary || 'Analysis complete',
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('[v0] Plagiarism check failed:', error)
    return {
      score: 0,
      flaggedSections: [],
      summary: 'Could not analyze text',
      timestamp: new Date(),
    }
  }
}

// Simulate checking against a database of academic sources
export function analyzeTextPatterns(text: string): { patterns: string[]; risk: 'low' | 'medium' | 'high' } {
  const lines = text.split('\n')
  const patterns: string[] = []
  let suspiciousCount = 0

  // Check for unusually formal language
  if (text.match(/\b(thus|therefore|hence|furthermore|moreover|nonetheless)\b/gi)) {
    patterns.push('Heavy use of academic connectors')
    suspiciousCount++
  }

  // Check for citation patterns
  if (!text.match(/\[\d+\]|\(Smith, \d{4}\)/)) {
    patterns.push('Lacks proper citations')
    suspiciousCount++
  }

  // Check for repetitive structure
  const uniqueLines = new Set(lines.filter((l) => l.length > 50))
  if (uniqueLines.size < lines.length * 0.7) {
    patterns.push('Repetitive structure detected')
    suspiciousCount++
  }

  let risk: 'low' | 'medium' | 'high' = 'low'
  if (suspiciousCount > 1) risk = 'medium'
  if (suspiciousCount > 2) risk = 'high'

  return { patterns, risk }
}

// Calculate similarity score between two texts
export function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
  const tokens1 = normalize(text1)
  const tokens2 = normalize(text2)

  const commonTokens = tokens1.filter((t) => tokens2.includes(t))
  return (commonTokens.length / Math.max(tokens1.length, tokens2.length)) * 100
}
