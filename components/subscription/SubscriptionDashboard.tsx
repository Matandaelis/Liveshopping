'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Check, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { SUBSCRIPTION_FEATURES, SUBSCRIPTION_PRICING } from '@/lib/subscriptions'

interface SubscriptionData {
  tier: string
  status: string
  currentPeriodStart?: string
  currentPeriodEnd?: string
  stripeCustomerId?: string
}

export default function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription')
        if (response.ok) {
          const data = await response.json()
          setSubscription(data)
        }
      } catch (error) {
        console.error('[v0] Failed to fetch subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-muted rounded-lg"></div>
    </div>
  }

  const currentTier = (subscription?.tier || 'FREE') as keyof typeof SUBSCRIPTION_FEATURES
  const currentFeatures = SUBSCRIPTION_FEATURES[currentTier]
  const currentPricing = SUBSCRIPTION_PRICING[currentTier]

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{currentTier}</p>
              <p className="text-muted-foreground">
                {currentPricing.price === 0 ? 'Free forever' : `${currentPricing.price}/month`}
              </p>
            </div>
            <Badge variant={subscription?.status === 'ACTIVE' ? 'default' : 'destructive'}>
              {subscription?.status || 'ACTIVE'}
            </Badge>
          </div>

          {subscription?.currentPeriodEnd && (
            <p className="text-sm text-muted-foreground">
              Renewal date: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          )}

          {currentTier !== 'ENTERPRISE' && currentTier !== 'PREMIUM' && (
            <div className="pt-4">
              <Link href="/pricing">
                <Button className="w-full">Upgrade Plan</Button>
              </Link>
            </div>
          )}

          {subscription?.status === 'PAST_DUE' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your payment failed. Please update your payment method to avoid losing access.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Features Included */}
      <Card>
        <CardHeader>
          <CardTitle>Included Features</CardTitle>
          <CardDescription>What's included in your {currentTier} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Documents</p>
                  <p className="text-sm text-muted-foreground">
                    {currentFeatures.maxDocuments === -1
                      ? 'Unlimited'
                      : `Up to ${currentFeatures.maxDocuments}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">AI Suggestions</p>
                  <p className="text-sm text-muted-foreground">
                    {currentFeatures.maxAISuggestions === -1
                      ? 'Unlimited'
                      : `${currentFeatures.maxAISuggestions}/month`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Plagiarism Scans</p>
                  <p className="text-sm text-muted-foreground">
                    {currentFeatures.maxPlagiarismScans === -1
                      ? 'Unlimited'
                      : `${currentFeatures.maxPlagiarismScans}/month`}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {currentFeatures.hasCollaboration ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">Collaboration</p>
                  <p className="text-sm text-muted-foreground">
                    {currentFeatures.hasCollaboration ? 'Enabled' : 'Not included'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {currentFeatures.hasTemplates ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <X className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">University Templates</p>
                  <p className="text-sm text-muted-foreground">
                    {currentFeatures.hasTemplates ? 'All templates' : 'Basic only'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Support</p>
                  <p className="text-sm text-muted-foreground">{currentFeatures.supportLevel}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage your invoices and payment methods in the{' '}
            <a href="https://billing.stripe.com/p/login" target="_blank" rel="noopener noreferrer" className="underline">
              Stripe Customer Portal
            </a>
          </p>
          <a href="https://billing.stripe.com/p/login" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="mt-4">
              Access Billing Portal
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {currentTier !== 'FREE' && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100">Danger Zone</CardTitle>
            <CardDescription className="text-red-800 dark:text-red-200">
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">
              Cancel your subscription to downgrade to the free plan. You'll lose access to premium features at the end of your billing period.
            </p>
            <Button variant="destructive">Cancel Subscription</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
