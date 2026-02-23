'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CheckoutFormProps {
  planId: string;
  planName: string;
  price: number;
  billingPeriod: 'MONTHLY' | 'ANNUAL';
}

export function CheckoutForm({ planId, planName, price, billingPeriod }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingPeriod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      router.push(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-border rounded-lg">
        <h3 className="font-semibold text-lg mb-2">{planName}</h3>
        <p className="text-2xl font-bold mb-4">
          ${price.toFixed(2)}<span className="text-sm text-muted-foreground">/{billingPeriod.toLowerCase()}</span>
        </p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
          {error}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        By subscribing, you agree to our{' '}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>
      </p>
    </div>
  );
}
