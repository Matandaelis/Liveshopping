import { DocumentEditor } from '@/components/editor/DocumentEditor';

export const metadata = {
  title: 'Document Editor - ThesisAI',
  description: 'Write and edit your thesis with AI assistance',
};

interface EditorPageProps {
  params: { id: string };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background">
      <DocumentEditor documentId={id} />
    </main>
  );
}
