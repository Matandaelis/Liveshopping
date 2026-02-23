import Header from '@/components/landing/Header';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata = {
  title: 'Dashboard - ThesisAI',
  description: 'Manage your thesis documents and track progress',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <DashboardContent />
      </main>
    </div>
  );
}
