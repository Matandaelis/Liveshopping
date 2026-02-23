'use client';

import { useState, useEffect } from 'react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Save, Download, Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ThesisEditorPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('Untitled Thesis');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Auto-save thesis every 30 seconds
  useEffect(() => {
    const saveInterval = setInterval(async () => {
      if (content && user) {
        setIsSaving(true);
        try {
          await fetch('/api/thesis/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              content,
              userId: user.id,
            }),
          });
          setLastSaved(new Date().toLocaleTimeString());
        } catch (error) {
          console.error('[v0] Save error:', error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [content, title, user]);

  const handleManualSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/thesis/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          userId: user.id,
        }),
      });
      
      if (response.ok) {
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('[v0] Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>${title}</h1>
        ${content}
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex-1">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold bg-transparent border-0 px-0 focus-visible:ring-0"
                placeholder="Thesis Title"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Last saved: {lastSaved || 'Not saved yet'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSave}
                disabled={isSaving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-0 overflow-hidden shadow-lg">
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your thesis... Use Cmd+/ for AI suggestions"
            />
          </Card>
        </div>

        {/* Word Count Footer */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              {content ? `Words: ${content.split(/\s+/).filter(w => w).length}` : 'Start typing...'}
            </div>
            <div>
              {user && `Signed in as: ${user.email}`}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
