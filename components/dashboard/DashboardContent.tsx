'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  title: string;
  status: string;
  wordCount: number;
  lastModified: string;
  template?: string;
}

export function DashboardContent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        // TODO: Fetch from /api/documents
        setDocuments([
          {
            id: '1',
            title: 'Chapter 1: Introduction',
            status: 'DRAFT',
            wordCount: 2500,
            lastModified: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Chapter 2: Literature Review',
            status: 'IN_PROGRESS',
            wordCount: 3200,
            lastModified: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const handleNewDocument = async () => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled Document',
          content: '',
        }),
      });

      if (response.ok) {
        const doc = await response.json();
        setDocuments([...documents, doc]);
      }
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Documents</h1>
        <Button onClick={handleNewDocument}>New Document</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:border-primary cursor-pointer transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Status: <span className="font-medium text-foreground">{doc.status}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Words: <span className="font-medium text-foreground">{doc.wordCount}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Last modified: <span className="font-medium text-foreground">{new Date(doc.lastModified).toLocaleDateString()}</span>
                </p>
              </div>
              <Link href={`/editor/${doc.id}`}>
                <Button className="w-full">Edit</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {documents.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-muted-foreground mb-4">You haven't created any documents yet</p>
          <Button onClick={handleNewDocument}>Create Your First Document</Button>
        </Card>
      )}
    </div>
  );
}
