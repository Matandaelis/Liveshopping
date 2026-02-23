'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Save, Download, Share2, Zap, Shield, Loader } from 'lucide-react'

interface Document {
  id: string
  title: string
  content: string
  wordCount: number
  status: string
}

export default function ThesisEditorPage() {
  const searchParams = useSearchParams()
  const documentId = searchParams.get('id')

  const [document, setDocument] = useState<Document | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAI, setShowAI] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (!documentId) return

    const loadDocument = async () => {
      try {
        const response = await fetch(`/api/documents/${documentId}`)
        if (response.ok) {
          const data = await response.json()
          setDocument(data)
          setTitle(data.title)
          setContent(data.content || '')
        }
      } catch (error) {
        console.error('[v0] Load error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [documentId])

  const handleSave = async () => {
    if (!documentId) return

    setIsSaving(true)
    try {
      const wordCount = content.split(/\s+/).length
      await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          wordCount,
          status: document?.status,
        }),
      })
      setLastSaved(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('[v0] Save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAISuggestion = async () => {
    if (!content.trim()) return

    setAiLoading(true)
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content.substring(0, 1000),
          type: 'improve',
          documentId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setShowAI(true)
        // Show suggestion in a toast or modal
        alert(`Suggestion: ${data.suggestion}`)
      }
    } catch (error) {
      console.error('[v0] AI error:', error)
    } finally {
      setAiLoading(false)
    }
  }

  const handlePlagiarismCheck = async () => {
    if (!content.trim() || content.split(/\s+/).length < 50) {
      alert('Minimum 50 words required for plagiarism check')
      return
    }

    try {
      const response = await fetch('/api/plagiarism/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: content,
          documentId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Plagiarism Score: ${data.similarityPercentage}%\n${data.message}`)
      }
    } catch (error) {
      console.error('[v0] Plagiarism error:', error)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-0 px-0 focus-visible:ring-0 h-auto"
                placeholder="Thesis Title"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {content.split(/\s+/).length} words · Last saved: {lastSaved || 'Not saved'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handleAISuggestion}
                disabled={aiLoading}
                variant="outline"
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                {aiLoading ? 'Suggesting...' : 'AI'}
              </Button>
              <Button
                onClick={handlePlagiarismCheck}
                variant="outline"
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Check
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline">{document.status}</Badge>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-0 overflow-hidden">
          <CardContent className="p-0">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thesis..."
              className="w-full h-[calc(100vh-200px)] p-6 border-0 bg-background text-foreground focus:outline-none resize-none font-serif"
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

