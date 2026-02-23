'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Check, X, Copy } from 'lucide-react'
import type { WritingSuggestion } from '@/lib/ai-suggestions'

interface AISuggestionsProps {
  selectedText: string
  onInsert?: (text: string) => void
  onReplace?: (original: string, replacement: string) => void
}

export function AISuggestions({ selectedText, onInsert, onReplace }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetSuggestions = async () => {
    if (!selectedText.trim()) {
      setError('Please select text to improve')
      return
    }

    setLoading(true)
    setError(null)
    setSuggestions([])

    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedText, bulk: true }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to generate suggestions')
        return
      }

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (err) {
      setError('Error connecting to AI service')
      console.error('[v0] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = (suggestion: WritingSuggestion) => {
    onReplace?.(suggestion.original, suggestion.suggestion)
    setSuggestions(suggestions.filter((s) => s !== suggestion))
  }

  if (!selectedText.trim()) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 mx-auto mb-2 opacity-50" />
          Select text to see AI improvement suggestions
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Writing Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded text-sm text-foreground max-h-24 overflow-y-auto">
          "{selectedText.substring(0, 200)}{selectedText.length > 200 ? '...' : ''}"
        </div>

        <Button
          onClick={handleGetSuggestions}
          disabled={loading}
          className="w-full gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? 'Generating suggestions...' : 'Get Suggestions'}
        </Button>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
            {error}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-3">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(suggestion.confidence * 100)}% confidence
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground">Suggestion:</p>
                  <p className="text-sm bg-background p-2 rounded border border-border text-foreground">
                    {suggestion.suggestion}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground italic">
                  {suggestion.explanation}
                </p>

                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(suggestion.suggestion)
                    }}
                    className="h-7 text-xs"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleAccept(suggestion)}
                    className="h-7 text-xs text-green-600 hover:text-green-700"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSuggestions(suggestions.filter((s) => s !== suggestion))}
                    className="h-7 text-xs text-red-600 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
