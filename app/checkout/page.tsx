import Header from '@/components/landing/Header';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export const metadata = {
  title: 'Checkout - ThesisAI',
  description: 'Complete your subscription to ThesisAI',
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">Complete Your Purchase</h1>
        <CheckoutForm
          planId="pro-monthly"
          planName="Pro Plan"
          price={9.99}
          billingPeriod="MONTHLY"
        />
      </main>
    </div>
  );
}
