'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Citation {
  id: string;
  title: string;
  authors?: string;
  year?: number;
  citationStyle: string;
  formattedText?: string;
}

interface CitationManagerProps {
  documentId: string;
  onCitationAdd?: (citation: Citation) => void;
}

export function CitationManager({ documentId, onCitationAdd }: CitationManagerProps) {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [citationStyle, setCitationStyle] = useState<'APA' | 'MLA' | 'Chicago'>('APA');
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    year: new Date().getFullYear(),
    url: '',
  });

  const handleAddCitation = async () => {
    if (!formData.title) return;

    try {
      const response = await fetch(`/api/documents/${documentId}/citations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          citationStyle,
        }),
      });

      if (response.ok) {
        const newCitation = await response.json();
        setCitations([...citations, newCitation]);
        setFormData({ title: '', authors: '', year: new Date().getFullYear(), url: '' });
        setShowForm(false);
        onCitationAdd?.(newCitation);
      }
    } catch (error) {
      console.error('Failed to add citation:', error);
    }
  };

  const handleDeleteCitation = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/citations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCitations(citations.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete citation:', error);
    }
  };

  const generateBibliography = () => {
    const bib = citations
      .map((c) => c.formattedText || c.title)
      .join('\n\n');
    return bib;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Citation Manager</span>
          <div className="flex gap-2">
            <select
              value={citationStyle}
              onChange={(e) => setCitationStyle(e.target.value as any)}
              className="text-sm px-2 py-1 bg-background border border-border rounded"
            >
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
            </select>
            <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Citation'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {showForm && (
          <div className="p-4 border border-border rounded-lg space-y-3 bg-card">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              placeholder="Authors"
              value={formData.authors}
              onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            />
            <Input
              placeholder="URL (optional)"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <Button onClick={handleAddCitation} className="w-full">
              Add Citation
            </Button>
          </div>
        )}

        {/* Citations List */}
        <div className="space-y-2">
          {citations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No citations added yet</p>
          ) : (
            citations.map((citation) => (
              <div key={citation.id} className="p-3 bg-background border border-border rounded-lg flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-sm">{citation.title}</p>
                  {citation.authors && <p className="text-xs text-muted-foreground">{citation.authors}</p>}
                  {citation.year && <p className="text-xs text-muted-foreground">{citation.year}</p>}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteCitation(citation.id)}
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>

        {citations.length > 0 && (
          <div className="mt-4 p-4 bg-background border border-border rounded-lg">
            <p className="text-sm font-medium mb-2">Bibliography ({citationStyle})</p>
            <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
              {generateBibliography()}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
