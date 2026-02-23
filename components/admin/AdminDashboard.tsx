'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Mock data for analytics
const documentData = [
  { name: 'Mon', documents: 12, words: 4200 },
  { name: 'Tue', documents: 19, words: 6100 },
  { name: 'Wed', documents: 8, words: 2900 },
  { name: 'Thu', documents: 15, words: 5200 },
  { name: 'Fri', documents: 22, words: 7800 },
  { name: 'Sat', documents: 18, words: 6500 },
  { name: 'Sun', documents: 10, words: 3600 },
]

const userTierData = [
  { name: 'Free', value: 45 },
  { name: 'Starter', value: 28 },
  { name: 'Pro', value: 18 },
  { name: 'Enterprise', value: 9 },
]

const plagiarismData = [
  { name: '0-10%', users: 145 },
  { name: '10-20%', users: 87 },
  { name: '20-50%', users: 34 },
  { name: '50%+', users: 12 },
]

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']

interface AnalyticsMetrics {
  totalUsers: number
  activeDocuments: number
  totalWords: number
  avgPlagiarismScore: number
  subscriptionRevenue: number
  aiSuggestionsGenerated: number
}

interface AdminDashboardProps {
  metrics?: AnalyticsMetrics
}

export function AdminDashboard({ metrics }: AdminDashboardProps) {
  const defaultMetrics: AnalyticsMetrics = metrics || {
    totalUsers: 192,
    activeDocuments: 487,
    totalWords: 2840000,
    avgPlagiarismScore: 18.5,
    subscriptionRevenue: 8940,
    aiSuggestionsGenerated: 12450,
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultMetrics.totalUsers}</div>
            <p className="text-xs text-green-600 mt-1">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultMetrics.activeDocuments}</div>
            <p className="text-xs text-green-600 mt-1">+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Words Written</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(defaultMetrics.totalWords / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-green-600 mt-1">+15% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Plagiarism Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultMetrics.avgPlagiarismScore.toFixed(1)}%</div>
            <p className="text-xs text-blue-600 mt-1">Healthy average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscription Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${defaultMetrics.subscriptionRevenue}</div>
            <p className="text-xs text-green-600 mt-1">+22% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Suggestions Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(defaultMetrics.aiSuggestionsGenerated / 1000).toFixed(1)}K</div>
            <p className="text-xs text-green-600 mt-1">+18% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Document Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={documentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="documents"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Documents Created"
                />
                <Line
                  type="monotone"
                  dataKey="words"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Words Written (×100)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userTierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Plagiarism Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Plagiarism Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={plagiarismData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#3b82f6" name="Number of Users" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Universities */}
      <Card>
        <CardHeader>
          <CardTitle>Document Templates by University</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'University of Nairobi', documents: 156, color: 'bg-blue-100' },
              { name: 'Kenya Medical Training Centre', documents: 92, color: 'bg-purple-100' },
              { name: 'Mount Kenya University', documents: 78, color: 'bg-pink-100' },
              { name: 'Laikipia University', documents: 45, color: 'bg-amber-100' },
            ].map((uni) => (
              <div key={uni.name} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <p className="font-medium text-foreground">{uni.name}</p>
                  <p className="text-xs text-muted-foreground">{uni.documents} documents</p>
                </div>
                <Badge variant="outline">{uni.documents}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Feature Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Writing Suggestions', usage: 92 },
              { name: 'Plagiarism Detection', usage: 78 },
              { name: 'Citation Formatting', usage: 85 },
              { name: 'Grammar Check', usage: 68 },
            ].map((feature) => (
              <div key={feature.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{feature.name}</span>
                  <span className="text-xs text-muted-foreground">{feature.usage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${feature.usage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { tier: 'Free Plan', users: 85, color: 'bg-gray-100', badge: 'default' },
              { tier: 'Starter - $9/mo', users: 54, color: 'bg-blue-100', badge: 'secondary' },
              { tier: 'Pro - $29/mo', users: 35, color: 'bg-purple-100', badge: 'default' },
              { tier: 'Enterprise', users: 18, color: 'bg-amber-100', badge: 'secondary' },
            ].map((plan) => (
              <div key={plan.tier} className={`flex items-center justify-between p-3 rounded-lg ${plan.color}`}>
                <span className="font-medium text-foreground">{plan.tier}</span>
                <Badge variant={plan.badge as any}>{plan.users} users</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
