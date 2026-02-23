'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Citation, formatCitations, generateCitationKey } from '@/lib/citations';
import { Trash2, Copy, Check, Plus } from 'lucide-react';

interface CitationManagerProps {
  documentId: string;
  onCitationAdd?: (citation: Citation) => void;
}

export function CitationManager({ documentId, onCitationAdd }: CitationManagerProps) {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Citation>>({
    title: '',
    authors: [''],
    year: new Date().getFullYear(),
    url: '',
  });

  const handleAddCitation = async () => {
    if (!formData.title || !formData.authors?.[0]) {
      alert('Please fill in title and at least one author');
      return;
    }

    const newCitation: Citation = {
      id: `cite-${Date.now()}`,
      title: formData.title,
      authors: (formData.authors || ['']).filter((a) => a),
      year: formData.year || new Date().getFullYear(),
      url: formData.url,
      publicationTitle: formData.publicationTitle,
      pages: formData.pages,
      doi: formData.doi,
    };

    try {
      const response = await fetch(`/api/documents/${documentId}/citations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCitation),
      });

      if (response.ok) {
        setCitations([...citations, newCitation]);
        setFormData({ title: '', authors: [''], year: new Date().getFullYear(), url: '' });
        setShowForm(false);
        onCitationAdd?.(newCitation);
      }
    } catch (error) {
      console.error('Failed to add citation:', error);
      // Still add citation locally even if server fails
      setCitations([...citations, newCitation]);
      setFormData({ title: '', authors: [''], year: new Date().getFullYear(), url: '' });
      setShowForm(false);
    }
  };

  const handleDeleteCitation = async (id: string) => {
    try {
      await fetch(`/api/documents/${documentId}/citations/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete citation:', error);
    }
    setCitations(citations.filter((c) => c.id !== id));
  };

  const handleCopyCitation = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...(formData.authors || [''])];
    newAuthors[index] = value;
    setFormData({ ...formData, authors: newAuthors });
  };

  const handleAddAuthor = () => {
    const newAuthors = [...(formData.authors || ['']), ''];
    setFormData({ ...formData, authors: newAuthors });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Citation Manager</span>
          <Button
            size="sm"
            variant={showForm ? 'default' : 'outline'}
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {showForm ? 'Cancel' : 'Add Citation'}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {showForm && (
          <div className="p-4 border border-border rounded-lg space-y-3 bg-card">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
              <Input
                placeholder="Article or book title"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Authors</label>
              <div className="space-y-2">
                {(formData.authors || ['']).map((author, index) => (
                  <Input
                    key={index}
                    placeholder={`Author ${index + 1}`}
                    value={author || ''}
                    onChange={(e) => handleAuthorChange(index, e.target.value)}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddAuthor}
                className="mt-2 text-xs"
              >
                + Add Author
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Year</label>
                <Input
                  type="number"
                  placeholder="2024"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Publication</label>
                <Input
                  placeholder="Journal name"
                  value={formData.publicationTitle || ''}
                  onChange={(e) => setFormData({ ...formData, publicationTitle: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Pages</label>
                <Input
                  placeholder="e.g., 10-25"
                  value={formData.pages || ''}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">DOI</label>
                <Input
                  placeholder="10.xxxx/xxxxx"
                  value={formData.doi || ''}
                  onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">URL</label>
              <Input
                placeholder="https://..."
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>

            <Button onClick={handleAddCitation} className="w-full">
              Add Citation
            </Button>
          </div>
        )}

        {/* Citations List */}
        <div className="space-y-3">
          {citations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No citations added yet. Add your first source to get started.</p>
          ) : (
            citations.map((citation) => {
              const formats = formatCitations(citation);
              const citationKey = generateCitationKey(citation);

              return (
                <div key={citation.id} className="p-4 bg-background border border-border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{citation.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {citation.authors.join(', ')} ({citation.year})
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCitation(citation.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Citation Formats Tabs */}
                  <Tabs defaultValue="apa" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 text-xs h-8">
                      <TabsTrigger value="apa" className="text-xs">APA</TabsTrigger>
                      <TabsTrigger value="mla" className="text-xs">MLA</TabsTrigger>
                      <TabsTrigger value="chicago" className="text-xs">Chicago</TabsTrigger>
                    </TabsList>

                    {Object.entries(formats).map(([format, text]) => (
                      <TabsContent key={format} value={format} className="mt-2">
                        <div className="flex items-start gap-2">
                          <code className="flex-1 text-xs bg-muted p-2 rounded overflow-x-auto text-foreground whitespace-pre-wrap break-words">
                            {text}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCitation(text)}
                            className="flex-shrink-0 h-8 w-8 p-0"
                          >
                            {copiedId === text ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  {/* Citation Key */}
                  <Badge variant="secondary" className="text-xs inline-block">
                    Reference: [{citationKey}]
                  </Badge>
                </div>
              );
            })
          )}
        </div>

        {/* Export Bibliography */}
        {citations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Export Bibliography</h4>
            <Tabs defaultValue="apa" className="w-full">
              <TabsList className="grid w-full grid-cols-3 text-xs h-8">
                <TabsTrigger value="apa" className="text-xs">APA</TabsTrigger>
                <TabsTrigger value="mla" className="text-xs">MLA</TabsTrigger>
                <TabsTrigger value="chicago" className="text-xs">Chicago</TabsTrigger>
              </TabsList>

              {(['apa', 'mla', 'chicago'] as const).map((format) => (
                <TabsContent key={format} value={format} className="mt-2">
                  <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-muted rounded text-sm text-foreground">
                    {citations.map((citation, index) => {
                      const formats = formatCitations(citation);
                      return (
                        <div key={citation.id} className={index > 0 ? 'border-t border-border pt-2 mt-2' : ''}>
                          {formats[format]}
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      const bibliography = citations
                        .map((c) => formatCitations(c)[format])
                        .join('\n\n');
                      handleCopyCitation(bibliography);
                    }}
                  >
                    {copiedId ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    Copy All
                  </Button>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
