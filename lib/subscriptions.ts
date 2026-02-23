import { prisma } from './db'

export interface SubscriptionTierFeatures {
  FREE: {
    maxDocuments: number
    maxAISuggestions: number
    maxPlagiarismScans: number
    hasCollaboration: boolean
    hasTemplates: boolean
    supportLevel: string
  }
  PRO: {
    maxDocuments: number
    maxAISuggestions: number
    maxPlagiarismScans: number
    hasCollaboration: boolean
    hasTemplates: boolean
    supportLevel: string
  }
  PREMIUM: {
    maxDocuments: number
    maxAISuggestions: number
    maxPlagiarismScans: number
    hasCollaboration: boolean
    hasTemplates: boolean
    supportLevel: string
  }
  ENTERPRISE: {
    maxDocuments: number
    maxAISuggestions: number
    maxPlagiarismScans: number
    hasCollaboration: boolean
    hasTemplates: boolean
    supportLevel: string
  }
}

export const SUBSCRIPTION_FEATURES: SubscriptionTierFeatures = {
  FREE: {
    maxDocuments: 3,
    maxAISuggestions: 50,
    maxPlagiarismScans: 1,
    hasCollaboration: false,
    hasTemplates: true,
    supportLevel: 'NONE',
  },
  PRO: {
    maxDocuments: 20,
    maxAISuggestions: 500,
    maxPlagiarismScans: 10,
    hasCollaboration: true,
    hasTemplates: true,
    supportLevel: 'EMAIL',
  },
  PREMIUM: {
    maxDocuments: -1,
    maxAISuggestions: -1,
    maxPlagiarismScans: -1,
    hasCollaboration: true,
    hasTemplates: true,
    supportLevel: 'PRIORITY',
  },
  ENTERPRISE: {
    maxDocuments: -1,
    maxAISuggestions: -1,
    maxPlagiarismScans: -1,
    hasCollaboration: true,
    hasTemplates: true,
    supportLevel: 'DEDICATED',
  },
}

export const SUBSCRIPTION_PRICING = {
  FREE: {
    price: 0,
    billingPeriod: 'MONTHLY',
  },
  PRO: {
    price: 9.99,
    billingPeriod: 'MONTHLY',
    annualPrice: 99.99,
  },
  PREMIUM: {
    price: 19.99,
    billingPeriod: 'MONTHLY',
    annualPrice: 199.99,
  },
  ENTERPRISE: {
    price: null,
    billingPeriod: 'CUSTOM',
  },
}

export async function getUserSubscription(userId: string) {
  try {
    if (!prisma) return null
    return await prisma.subscription.findUnique({
      where: { userId },
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}

export async function hasFeatureAccess(
  userId: string,
  feature: 'documents' | 'aiSuggestions' | 'plagiarismScans' | 'collaboration' | 'templates'
): Promise<boolean> {
  try {
    if (!prisma) return false
    const subscription = await getUserSubscription(userId)
    if (!subscription) return feature !== 'collaboration'

    const tier = subscription.tier as keyof typeof SUBSCRIPTION_FEATURES
    const features = SUBSCRIPTION_FEATURES[tier]

    switch (feature) {
      case 'documents': {
        const docCount = await prisma.document.count({ where: { userId } })
        return features.maxDocuments === -1 || docCount < features.maxDocuments
      }
      case 'aiSuggestions': {
        const stats = await prisma.userStats.findUnique({ where: { userId } })
        return features.maxAISuggestions === -1 || (stats?.aiSuggestionsUsed || 0) < features.maxAISuggestions
      }
      case 'plagiarismScans': {
        const scanCount = await prisma.plagiarismScan.count({
          where: { document: { userId } },
        })
        return features.maxPlagiarismScans === -1 || scanCount < features.maxPlagiarismScans
      }
      case 'collaboration':
        return features.hasCollaboration
      case 'templates':
        return features.hasTemplates
      default:
        return false
    }
  } catch (error) {
    console.error('Error checking feature access:', error)
    return false
  }
}

export async function createUserSubscription(userId: string, planId: string) {
  try {
    if (!prisma) return null
    return await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'ACTIVE',
      },
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    throw error
  }
}

export async function initializeUserStats(userId: string) {
  try {
    if (!prisma) return null
    return await prisma.userStats.upsert({
      where: { userId },
      update: {},
      create: { userId },
    })
  } catch (error) {
    console.error('Error initializing stats:', error)
    throw error
  }
}

export async function updateUserStats(userId: string, data: { documentsCreated?: number; aiSuggestionsUsed?: number }) {
  try {
    if (!prisma) return null
    return await prisma.userStats.update({
      where: { userId },
      data,
    })
  } catch (error) {
    console.error('Error updating stats:', error)
    throw error
  }
}
