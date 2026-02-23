// Prisma disabled during build - DATABASE_URL not configured
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// TODO: Enable after DATABASE_URL is set in environment

export interface SubscriptionTierFeatures {
  FREE: {
    maxDocuments: number;
    maxAISuggestions: number;
    maxPlagiarismScans: number;
    hasCollaboration: boolean;
    hasTemplates: boolean;
    supportLevel: string;
  };
  PRO: {
    maxDocuments: number;
    maxAISuggestions: number;
    maxPlagiarismScans: number;
    hasCollaboration: boolean;
    hasTemplates: boolean;
    supportLevel: string;
  };
  PREMIUM: {
    maxDocuments: number;
    maxAISuggestions: number;
    maxPlagiarismScans: number;
    hasCollaboration: boolean;
    hasTemplates: boolean;
    supportLevel: string;
  };
  ENTERPRISE: {
    maxDocuments: number;
    maxAISuggestions: number;
    maxPlagiarismScans: number;
    hasCollaboration: boolean;
    hasTemplates: boolean;
    supportLevel: string;
  };
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
    maxDocuments: -1, // unlimited
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
};

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
    price: null, // Custom pricing
    billingPeriod: 'CUSTOM',
  },
};

/**
 * Get user's subscription and tier
 */
export async function getUserSubscription(userId: string) {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });
    return subscription;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }
}

/**
 * Check if user has access to a feature
 */
export async function hasFeatureAccess(
  userId: string,
  feature: 'documents' | 'aiSuggestions' | 'plagiarismScans' | 'collaboration' | 'templates',
  currentUsage?: number
): Promise<boolean> {
  try {
    const subscription = await getUserSubscription(userId);
    if (!subscription) return false;

    const tier = subscription.plan.tier as keyof typeof SUBSCRIPTION_FEATURES;
    const features = SUBSCRIPTION_FEATURES[tier];

    switch (feature) {
      case 'documents':
        const docCount = await prisma.document.count({ where: { userId } });
        return features.maxDocuments === -1 || docCount < features.maxDocuments;
      
      case 'aiSuggestions':
        const stats = await prisma.userStats.findUnique({ where: { userId } });
        return features.maxAISuggestions === -1 || (stats?.aiSuggestionsUsed || 0) < features.maxAISuggestions;
      
      case 'plagiarismScans':
        const scanCount = await prisma.plagiarismScan.count({ where: { document: { userId } } });
        return features.maxPlagiarismScans === -1 || scanCount < features.maxPlagiarismScans;
      
      case 'collaboration':
        return features.hasCollaboration;
      
      case 'templates':
        return features.hasTemplates;
      
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}

/**
 * Create or update subscription plan
 */
export async function createOrUpdateSubscriptionPlan(
  tier: string,
  data: {
    name: string;
    price: number;
    billingPeriod: string;
    description?: string;
    features?: string[];
    maxDocuments?: number;
    maxAISuggestions?: number;
    maxPlagiarismScans?: number;
    hasCollaboration?: boolean;
    hasTemplates?: boolean;
    supportLevel?: string;
  }
) {
  try {
    const plan = await prisma.subscriptionPlan.upsert({
      where: { tier },
      update: data,
      create: { tier, ...data },
    });
    return plan;
  } catch (error) {
    console.error('Error creating/updating subscription plan:', error);
    throw error;
  }
}

/**
 * Create subscription for user
 */
export async function createUserSubscription(
  userId: string,
  planId: string,
  stripeSubscriptionId?: string,
  stripeCustomerId?: string
) {
  try {
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'ACTIVE',
        stripeSubscriptionId,
        stripeCustomerId,
      },
      include: { plan: true },
    });

    // Update user's subscription tier
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionId: subscription.id,
        subscriptionTier: subscription.plan.tier,
        stripeCustomerId: stripeCustomerId || undefined,
      },
    });

    return subscription;
  } catch (error) {
    console.error('Error creating user subscription:', error);
    throw error;
  }
}

/**
 * Initialize user stats
 */
export async function initializeUserStats(userId: string) {
  try {
    const stats = await prisma.userStats.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
    return stats;
  } catch (error) {
    console.error('Error initializing user stats:', error);
    throw error;
  }
}

/**
 * Update user stats
 */
export async function updateUserStats(
  userId: string,
  data: {
    documentsCreated?: number;
    aiSuggestionsUsed?: number;
    plagiarismScansUsed?: number;
    totalWritingTime?: number;
    lastActivityDate?: Date;
  }
) {
  try {
    const stats = await prisma.userStats.update({
      where: { userId },
      data,
    });
    return stats;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
}
