'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with thesis writing',
    features: [
      'Up to 3 thesis documents',
      '50 AI suggestions per month',
      '1 plagiarism scan per month',
      'Basic templates (5+ universities)',
      'Email support',
      'APA & MLA citation styles',
    ],
    notIncluded: [
      'Real-time collaboration',
      'Advanced AI models',
      'Priority support',
      'Custom templates',
    ],
    cta: 'Get Started',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'month',
    billingPeriod: 'MONTHLY',
    description: 'For serious thesis writers',
    features: [
      'Up to 20 thesis documents',
      'Unlimited AI suggestions',
      '10 plagiarism scans per month',
      'All templates (50+ universities)',
      'Real-time collaboration (3 users)',
      'All citation styles',
      'Priority email support',
      'Writing analytics & insights',
    ],
    notIncluded: [
      'Enterprise support',
      'Advanced analytics',
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'default' as const,
    highlighted: true,
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: 'month',
    billingPeriod: 'MONTHLY',
    description: 'Everything for thesis success',
    features: [
      'Unlimited thesis documents',
      'Unlimited AI suggestions',
      'Unlimited plagiarism scans',
      'All university templates',
      'Unlimited collaboration',
      'All citation styles',
      '24/7 priority support',
      'Advanced writing analytics',
      'AI model selection (Groq + Claude)',
      'Custom document formatting',
      'Research paper database access',
    ],
    notIncluded: [
      'Enterprise features',
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'default' as const,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'For institutions & research groups',
    features: [
      'Everything in Premium',
      'Institutional accounts',
      'Custom user management',
      'Advanced analytics dashboard',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantees',
      'White-label options',
      'API access',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
  },
];

const comparisonFeatures = [
  { category: 'Documents', feature: 'Maximum documents' },
  { category: 'AI', feature: 'AI suggestions per month' },
  { category: 'AI', feature: 'AI model selection' },
  { category: 'Plagiarism', feature: 'Plagiarism scans per month' },
  { category: 'Templates', feature: 'University templates' },
  { category: 'Collaboration', feature: 'Real-time collaboration' },
  { category: 'Support', feature: 'Support level' },
  { category: 'Analytics', feature: 'Writing analytics' },
];

export function PricingCard({ plan, onSelect }: { plan: typeof plans[0]; onSelect: (plan: string) => void }) {
  return (
    <div
      className={`relative rounded-xl border-2 p-8 space-y-6 transition-all duration-300 ${
        plan.highlighted
          ? 'border-primary bg-gradient-to-br from-primary/5 to-transparent scale-105'
          : 'border-border hover:border-primary/50'
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
        <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-foreground">{plan.price}</span>
          <span className="text-muted-foreground">/ {plan.period}</span>
        </div>
        {plan.price !== 'Custom' && plan.name !== 'Free' && (
          <p className="text-xs text-muted-foreground">Annual billing: Save 17%</p>
        )}
      </div>

      <Button
        size="lg"
        variant={plan.ctaVariant}
        className="w-full"
        onClick={() => onSelect(plan.name)}
      >
        {plan.cta}
      </Button>

      <div className="space-y-3 py-6 border-y border-border">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
        {plan.notIncluded.length > 0 && (
          <>
            <div className="pt-3" />
            {plan.notIncluded.map((feature) => (
              <div key={feature} className="flex items-start gap-3 opacity-50">
                <div className="w-5 h-5 border border-muted rounded flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Enterprise') {
      window.location.href = 'mailto:sales@thesisai.com?subject=Enterprise Inquiry';
    } else if (planName === 'Free') {
      window.location.href = '/dashboard/signup';
    } else {
      window.location.href = `/pricing?plan=${planName.toLowerCase()}&cycle=${billingCycle}`;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your thesis writing journey. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-card rounded-lg p-1 flex items-center gap-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-secondary/50 px-2 py-1 rounded">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} onSelect={handleSelectPlan} />
          ))}
        </div>

        <div className="mt-20 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Detailed Comparison</h2>
            <p className="text-muted-foreground">See exactly what's included in each plan</p>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="px-6 py-4 text-center text-sm font-semibold text-foreground min-w-32">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparisonFeatures.map((item) => (
                  <tr key={item.feature}>
                    <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{item.feature}</td>
                    {plans.map((plan) => (
                      <td key={plan.name} className="px-6 py-4 text-center text-sm">
                        {plan.name === 'Free' && (
                          <>
                            {item.feature === 'Maximum documents' && '3'}
                            {item.feature === 'AI suggestions per month' && '50'}
                            {item.feature === 'AI model selection' && <X className="w-5 h-5 mx-auto text-muted" />}
                            {item.feature === 'Plagiarism scans per month' && '1'}
                            {item.feature === 'University templates' && '5+'}
                            {item.feature === 'Real-time collaboration' && <X className="w-5 h-5 mx-auto text-muted" />}
                            {item.feature === 'Support level' && 'Email'}
                            {item.feature === 'Writing analytics' && <X className="w-5 h-5 mx-auto text-muted" />}
                          </>
                        )}
                        {plan.name === 'Pro' && (
                          <>
                            {item.feature === 'Maximum documents' && '20'}
                            {item.feature === 'AI suggestions per month' && 'Unlimited'}
                            {item.feature === 'AI model selection' && 'Groq'}
                            {item.feature === 'Plagiarism scans per month' && '10'}
                            {item.feature === 'University templates' && '50+'}
                            {item.feature === 'Real-time collaboration' && '3 users'}
                            {item.feature === 'Support level' && 'Priority Email'}
                            {item.feature === 'Writing analytics' && <Check className="w-5 h-5 mx-auto text-primary" />}
                          </>
                        )}
                        {plan.name === 'Premium' && (
                          <>
                            {item.feature === 'Maximum documents' && 'Unlimited'}
                            {item.feature === 'AI suggestions per month' && 'Unlimited'}
                            {item.feature === 'AI model selection' && 'Groq + Claude'}
                            {item.feature === 'Plagiarism scans per month' && 'Unlimited'}
                            {item.feature === 'University templates' && 'All'}
                            {item.feature === 'Real-time collaboration' && 'Unlimited'}
                            {item.feature === 'Support level' && '24/7 Priority'}
                            {item.feature === 'Writing analytics' && <Check className="w-5 h-5 mx-auto text-primary" />}
                          </>
                        )}
                        {plan.name === 'Enterprise' && (
                          <>
                            {item.feature === 'Maximum documents' && 'Unlimited'}
                            {item.feature === 'AI suggestions per month' && 'Unlimited'}
                            {item.feature === 'AI model selection' && 'Custom'}
                            {item.feature === 'Plagiarism scans per month' && 'Unlimited'}
                            {item.feature === 'University templates' && 'All + Custom'}
                            {item.feature === 'Real-time collaboration' && 'Unlimited'}
                            {item.feature === 'Support level' && 'Dedicated'}
                            {item.feature === 'Writing analytics' && <Check className="w-5 h-5 mx-auto text-primary" />}
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Still Have Questions?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our team is ready to help. Contact us for a demo or to discuss custom enterprise solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="mailto:support@thesisai.com">
              <Button variant="outline">Email Support</Button>
            </Link>
            <Link href="mailto:sales@thesisai.com">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function X({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default PricingPage;
