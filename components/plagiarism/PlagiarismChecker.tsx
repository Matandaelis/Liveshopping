'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle, Zap, Loader } from 'lucide-react'

interface PlagiarismReport {
  score: number
  flaggedSections: Array<{ text: string; similarity: number; source?: string }>
  summary: string
  patterns: string[]
  risk: 'low' | 'medium' | 'high'
  wordCount: number
  timestamp: Date
}

interface PlagiarismCheckerProps {
  documentId?: string
  onCheckStart?: () => void
  onCheckComplete?: (report: PlagiarismReport) => void
}

export function PlagiarismChecker({ documentId, onCheckStart, onCheckComplete }: PlagiarismCheckerProps) {
  const [report, setReport] = useState<PlagiarismReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckPlagiarism = async (text?: string) => {
    if (!text) {
      setError('No text provided')
      return
    }

    setLoading(true)
    setError(null)
    onCheckStart?.()

    try {
      const response = await fetch('/api/plagiarism/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, documentId }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to check plagiarism')
        return
      }

      const data = await response.json()
      setReport(data)
      onCheckComplete?.(data)
    } catch (err) {
      setError('Error connecting to plagiarism service')
      console.error('[v0] Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-50 border-green-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'high':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Plagiarism Detector
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!report ? (
          <>
            <p className="text-sm text-muted-foreground">
              Check your document for potential plagiarism and similarities with academic sources.
            </p>
            <Button
              onClick={() => handleCheckPlagiarism('sample text')}
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Start Plagiarism Check
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Score Display */}
            <div className={`p-4 rounded-lg border ${getRiskBg(report.risk)}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Plagiarism Score</h3>
                <Badge className={getRiskColor(report.risk)}>
                  {report.risk.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <span className={`text-3xl font-bold ${getRiskColor(report.risk)}`}>
                    {report.score}%
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">
                    {report.wordCount} words analyzed
                  </span>
                </div>
                <Progress value={report.score} className="h-2" />
              </div>
            </div>

            {/* Summary */}
            <div className="p-3 bg-background border border-border rounded-lg">
              <p className="text-sm text-foreground">{report.summary}</p>
            </div>

            {/* Risk Patterns */}
            {report.patterns.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Detected Patterns
                </p>
                <div className="space-y-1">
                  {report.patterns.map((pattern, idx) => (
                    <div key={idx} className="text-xs flex items-start gap-2 p-2 bg-muted rounded">
                      <span className="text-muted-foreground mt-0.5">•</span>
                      <span>{pattern}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
              <p className="font-medium mb-1">Recommendations:</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                {report.score > 30 && <li>Review flagged sections and verify citations</li>}
                {report.score < 20 && <li>Score looks good - document appears original</li>}
                <li>Always use proper citations for referenced material</li>
                <li>Consider using a formal plagiarism service for final submission</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setReport(null)}
                className="flex-1"
              >
                New Check
              </Button>
              <Button className="flex-1" disabled>
                Download Report
              </Button>
            </div>
          </>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
