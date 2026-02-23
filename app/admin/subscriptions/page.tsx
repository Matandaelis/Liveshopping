import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react'

export const metadata = {
  title: 'Subscription Management | ThesisAI Admin',
  description: 'Manage user subscriptions and billing',
}

// Mock data
const subscriptions = [
  {
    id: 'sub_1',
    userName: 'Alice Kipchoge',
    email: 'alice@example.com',
    plan: 'Pro',
    price: '$29/month',
    status: 'active',
    startDate: '2026-01-15',
    nextBillingDate: '2026-03-15',
    documents: 12,
  },
  {
    id: 'sub_2',
    userName: 'David Koech',
    email: 'david@example.com',
    plan: 'Starter',
    price: '$9/month',
    status: 'active',
    startDate: '2026-02-01',
    nextBillingDate: '2026-03-01',
    documents: 5,
  },
  {
    id: 'sub_3',
    userName: 'Grace Mwangi',
    email: 'grace@example.com',
    plan: 'Enterprise',
    price: '$99/month',
    status: 'active',
    startDate: '2025-12-10',
    nextBillingDate: '2026-03-10',
    documents: 28,
  },
  {
    id: 'sub_4',
    userName: 'James Omondi',
    email: 'james@example.com',
    plan: 'Free',
    price: '$0/month',
    status: 'active',
    startDate: '2026-02-10',
    nextBillingDate: null,
    documents: 2,
  },
  {
    id: 'sub_5',
    userName: 'Sarah Kimani',
    email: 'sarah@example.com',
    plan: 'Pro',
    price: '$29/month',
    status: 'past_due',
    startDate: '2026-01-20',
    nextBillingDate: '2026-02-20',
    documents: 18,
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>
      )
    case 'past_due':
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Past Due
        </Badge>
      )
    case 'cancelled':
      return (
        <Badge className="bg-gray-100 text-gray-800">
          Cancelled
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}

function getPlanColor(plan: string) {
  switch (plan) {
    case 'Enterprise':
      return 'bg-amber-50 border-amber-200'
    case 'Pro':
      return 'bg-purple-50 border-purple-200'
    case 'Starter':
      return 'bg-blue-50 border-blue-200'
    case 'Free':
      return 'bg-gray-50 border-gray-200'
    default:
      return 'bg-gray-50 border-gray-200'
  }
}

export default function SubscriptionsPage() {
  const totalMRR = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (parseInt(s.price) || 0), 0)

  const pastDueCount = subscriptions.filter((s) => s.status === 'past_due').length

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage all active subscriptions</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Recurring Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalMRR}</div>
              <p className="text-xs text-green-600 mt-1">+18% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptions.filter((s) => s.status === 'active').length}</div>
              <p className="text-xs text-green-600 mt-1">+5 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Past Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{pastDueCount}</div>
              <p className="text-xs text-red-600 mt-1">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        <Card>
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${getPlanColor(sub.plan)}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium text-foreground">{sub.userName}</h3>
                        <p className="text-xs text-muted-foreground">{sub.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Plan</p>
                        <p className="font-medium text-foreground">{sub.plan}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium text-foreground">{sub.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Started</p>
                        <p className="font-medium text-foreground">{sub.startDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Billing</p>
                        <p className="font-medium text-foreground">{sub.nextBillingDate || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(sub.status)}
                    <Button variant="outline" size="sm" className="text-xs">
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Billing Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Active Plans</p>
                <p className="text-2xl font-bold text-foreground">
                  {subscriptions.filter((s) => s.status === 'active').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enterprise Plans</p>
                <p className="text-2xl font-bold text-foreground">
                  {subscriptions.filter((s) => s.plan === 'Enterprise').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Free Plans</p>
                <p className="text-2xl font-bold text-foreground">
                  {subscriptions.filter((s) => s.plan === 'Free').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-2xl font-bold text-foreground">2.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
