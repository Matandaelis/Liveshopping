'use client';

import { useState, useRef } from 'react';
import { WritingAssistant } from '@/components/writing-assistant/WritingAssistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentEditorProps {
  documentId?: string;
}

export function DocumentEditor({ documentId }: DocumentEditorProps) {
  const [content, setContent] = useState('');
  const [selectedText, setSelectedText] = useState<string>();
  const [showAssistant, setShowAssistant] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setWordCount(text.trim().split(/\s+/).filter((w) => w.length > 0).length);
  };

  const handleTextSelection = () => {
    const text = editorRef.current?.value || '';
    const start = editorRef.current?.selectionStart || 0;
    const end = editorRef.current?.selectionEnd || 0;

    if (start !== end) {
      const selected = text.substring(start, end);
      setSelectedText(selected);
      setShowAssistant(true);
    }
  };

  const saveDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          wordCount,
        }),
      });

      if (response.ok) {
        alert('Document saved successfully');
      }
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 min-h-screen p-6 bg-background">
      {/* Editor */}
      <div className="col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Document Editor</span>
              <span className="text-sm text-muted-foreground">Words: {wordCount}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <textarea
              ref={editorRef}
              value={content}
              onChange={handleContentChange}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              placeholder="Start writing your thesis..."
              className="flex-1 p-4 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAssistant(!showAssistant)}>
                {showAssistant ? 'Hide' : 'Show'} AI Assistant
              </Button>
              <Button onClick={saveDocument}>Save Document</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Sidebar */}
      {showAssistant && (
        <div className="col-span-1">
          <WritingAssistant documentId={documentId} selectedText={selectedText} />
        </div>
      )}
    </div>
  );
}
