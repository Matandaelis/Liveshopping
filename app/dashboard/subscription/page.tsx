import { Metadata } from 'next'
import Header from '@/components/landing/Header'
import SubscriptionDashboard from '@/components/subscription/SubscriptionDashboard'

export const metadata: Metadata = {
  title: 'Subscription - ThesisAI',
  description: 'Manage your subscription and billing',
}

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold">Subscription & Billing</h1>
            <p className="text-muted-foreground mt-2">
              Manage your plan, payment methods, and billing history
            </p>
          </div>
          <SubscriptionDashboard />
        </div>
      </main>
    </div>
  )
}
