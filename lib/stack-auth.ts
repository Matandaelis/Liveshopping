// Stack Auth integration utilities
// Uses existing neon_auth schema tables from Stack Auth

export interface StackUser {
  id: string
  email: string
  name: string | null
  image: string | null
  emailVerified: boolean
  createdAt: Date
}

export interface StackSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
}

// Parse Stack Auth JWT from cookies
export function parseStackAuthToken(cookieString: string): string | null {
  if (!cookieString) return null
  const cookies = cookieString.split(';').map(c => c.trim())
  const authCookie = cookies.find(c => c.startsWith('stack-auth='))
  return authCookie?.split('=')[1] || null
}

// Get current user from Stack Auth context
export async function getCurrentStackUser(req: Request): Promise<StackUser | null> {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return null
    
    // In production, verify the JWT token with Stack Auth
    // For now, return null - real implementation uses Stack Auth SDK
    return null
  } catch (error) {
    console.error('Error getting Stack Auth user:', error)
    return null
  }
}

// Check if user has subscription tier access
export function hasSubscriptionAccess(tier: string, requiredTier: string): boolean {
  const tierLevels: Record<string, number> = {
    'FREE': 0,
    'PRO': 1,
    'PREMIUM': 2,
    'ENTERPRISE': 3,
  }
  
  const userLevel = tierLevels[tier] || 0
  const requiredLevel = tierLevels[requiredTier] || 0
  
  return userLevel >= requiredLevel
}

// Calculate feature limits based on subscription tier
export function getSubscriptionLimits(tier: string) {
  const limits: Record<string, any> = {
    'FREE': {
      documents: 3,
      aiSuggestions: 50,
      plagiarismScans: 1,
      collaborators: 0,
      storageGB: 1,
    },
    'PRO': {
      documents: 50,
      aiSuggestions: 500,
      plagiarismScans: 10,
      collaborators: 3,
      storageGB: 10,
    },
    'PREMIUM': {
      documents: -1, // unlimited
      aiSuggestions: -1,
      plagiarismScans: -1,
      collaborators: 10,
      storageGB: 100,
    },
    'ENTERPRISE': {
      documents: -1,
      aiSuggestions: -1,
      plagiarismScans: -1,
      collaborators: -1,
      storageGB: 1000,
    },
  }
  
  return limits[tier] || limits['FREE']
}
