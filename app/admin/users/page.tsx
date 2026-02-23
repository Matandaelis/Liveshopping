import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Mail, MoreVertical } from 'lucide-react'

export const metadata = {
  title: 'User Management | ThesisAI Admin',
  description: 'Manage platform users and subscriptions',
}

// Mock data
const users = [
  {
    id: 1,
    name: 'Alice Kipchoge',
    email: 'alice@example.com',
    university: 'University of Nairobi',
    tier: 'Pro',
    joinDate: '2026-01-15',
    documents: 12,
    lastActive: '2026-02-23',
  },
  {
    id: 2,
    name: 'David Koech',
    email: 'david@example.com',
    university: 'KEMU',
    tier: 'Starter',
    joinDate: '2026-02-01',
    documents: 5,
    lastActive: '2026-02-22',
  },
  {
    id: 3,
    name: 'Grace Mwangi',
    email: 'grace@example.com',
    university: 'Mount Kenya University',
    tier: 'Enterprise',
    joinDate: '2025-12-10',
    documents: 28,
    lastActive: '2026-02-23',
  },
  {
    id: 4,
    name: 'James Omondi',
    email: 'james@example.com',
    university: 'Laikipia University',
    tier: 'Free',
    joinDate: '2026-02-10',
    documents: 2,
    lastActive: '2026-02-20',
  },
  {
    id: 5,
    name: 'Sarah Kimani',
    email: 'sarah@example.com',
    university: 'University of Nairobi',
    tier: 'Pro',
    joinDate: '2026-01-20',
    documents: 18,
    lastActive: '2026-02-23',
  },
]

function getTierColor(tier: string) {
  switch (tier) {
    case 'Enterprise':
      return 'bg-amber-100 text-amber-800'
    case 'Pro':
      return 'bg-purple-100 text-purple-800'
    case 'Starter':
      return 'bg-blue-100 text-blue-800'
    case 'Free':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">{users.length} total users</p>
          </div>
          <Button>Add User</Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users by name or email..." className="pl-10" />
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">University</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tier</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Documents</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">{user.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-foreground text-xs">{user.university}</td>
                      <td className="py-3 px-4">
                        <Badge className={getTierColor(user.tier)}>{user.tier}</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">{user.documents}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{user.lastActive}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">Showing 1 to {users.length} of {users.length} users</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
