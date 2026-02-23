import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DownloadCloud, Settings, Users } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard | ThesisAI',
  description: 'Analytics and management dashboard for administrators',
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Platform analytics and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <DownloadCloud className="h-4 w-4" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">View and manage all platform users</p>
              <Button variant="outline" size="sm" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Go to Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Subscription Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">Monitor subscriptions and billing</p>
              <Button variant="outline" size="sm" className="w-full">
                View Subscriptions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-medium text-green-600">All Systems Operational</span>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled>
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <AdminDashboard />

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p>Dashboard auto-refreshes every 5 minutes</p>
        </div>
      </div>
    </div>
  )
}
