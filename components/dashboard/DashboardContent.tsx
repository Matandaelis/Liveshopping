'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Zap, Shield, Users } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  status: string;
  wordCount: number;
  updatedAt: string;
  template?: string;
}

interface UserStats {
  totalDocuments: number;
  totalWords: number;
  subscriptionTier: string;
  documentsRemaining: number;
}

export function DashboardContent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Fetch user documents
        const docsRes = await fetch('/api/documents');
        if (docsRes.ok) {
          const data = await docsRes.json();
          setDocuments(data.documents || []);
        }

        // Fetch user stats
        const statsRes = await fetch('/api/user/stats');
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (error) {
        console.error('[v0] Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleNewDocument = async () => {
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled Document',
          content: [],
        }),
      });

      if (response.ok) {
        const doc = await response.json();
        setDocuments([doc, ...documents]);
      }
    } catch (error) {
      console.error('[v0] Failed to create document:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      SUBMITTED: 'bg-green-100 text-green-800',
      ARCHIVED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors.DRAFT;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                  <p className="text-3xl font-bold">{stats.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Words</p>
                  <p className="text-3xl font-bold">{stats.totalWords.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-2xl font-bold">{stats.subscriptionTier}</p>
                </div>
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Documents Left</p>
                  <p className="text-3xl font-bold">{stats.documentsRemaining}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documents Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Documents</h2>
            <p className="text-sm text-muted-foreground mt-1">Create and manage your thesis documents</p>
          </div>
          <Button onClick={handleNewDocument} className="gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>

        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{doc.title}</CardTitle>
                    <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">{doc.wordCount.toLocaleString()}</span> words
                    </p>
                    <p className="text-muted-foreground">
                      Modified {new Date(doc.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/editor?id=${doc.id}`} className="flex-1">
                      <Button variant="default" className="w-full" size="sm">Edit</Button>
                    </Link>
                    <Button variant="outline" size="sm">More</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No documents yet</p>
              <Button onClick={handleNewDocument} variant="outline">
                Create Your First Document
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Get writing suggestions powered by AI</p>
            <Button variant="outline" className="w-full">AI Assistant</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Check Plagiarism</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Ensure your work is original</p>
            <Button variant="outline" className="w-full">Scan Document</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Upgrade Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Unlock premium features</p>
            <Link href="/pricing">
              <Button variant="outline" className="w-full">See Plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

