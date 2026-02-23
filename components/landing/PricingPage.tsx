'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 documents',
      '50 AI suggestions/month',
      '1 plagiarism scan/month',
      'Basic templates',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'month',
    description: 'For serious writers',
    features: [
      'Up to 20 documents',
      '500 AI suggestions/month',
      '10 plagiarism scans/month',
      'All templates',
      'Collaboration (3 users)',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: 'month',
    description: 'Unlimited features',
    features: [
      'Unlimited documents',
      'Unlimited AI suggestions',
      'Unlimited plagiarism scans',
      'All templates + custom',
      'Unlimited collaboration',
      '24/7 priority support',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For teams',
    features: [
      'Everything in Premium',
      'Team management',
      'Custom branding',
      'Dedicated support',
      'API access',
      'Admin dashboard',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const handleSelectPlan = async (planName: string) => {
    if (planName === 'Free') {
      window.location.href = '/dashboard'
    } else if (planName === 'Enterprise') {
      window.location.href = 'mailto:sales@thesisai.com'
    } else {
      try {
        const response = await fetch('/api/subscription/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier: planName.toUpperCase() }),
        })
        if (response.ok) {
          const data = await response.json()
          window.location.href = data.url
        }
      } catch (error) {
        console.error('[v0] Checkout error:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Choose the perfect plan for your thesis writing journey
          </p>
        </div>

        <div className="flex justify-center mb-12 gap-4">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'annual' ? 'default' : 'outline'}
            onClick={() => setBillingCycle('annual')}
          >
            Annual (Save 20%)
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-8 space-y-6 ${
                plan.highlighted ? 'border-primary shadow-lg scale-105 bg-primary/5' : 'border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <Button
                onClick={() => handleSelectPlan(plan.name)}
                variant={plan.highlighted ? 'default' : 'outline'}
                className="w-full"
              >
                {plan.cta}
              </Button>

              <div className="space-y-3 py-6 border-t border-b border-border">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20 p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">Questions?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our team is ready to help. Contact us for support.
          </p>
        </div>
      </div>
    </div>
  )
}
