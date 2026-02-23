// Prisma client with proper error handling and logging

import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['warn', 'error'] 
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Helper to safely run Prisma queries with error handling
export async function runWithErrorHandling<T>(
  fn: () => Promise<T>,
  context: string = 'Database operation'
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    console.error(`[v0] ${context} failed:`, error)
    // Return null instead of throwing to allow graceful degradation
    return null
  }
}

// Check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('[v0] Database connection successful')
    return true
  } catch (error) {
    console.error('[v0] Database connection failed:', error)
    return false
  }
}

// Disconnect on application shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

export default prisma
