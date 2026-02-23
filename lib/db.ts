import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function runWithErrorHandling<T>(
  fn: () => Promise<T>,
  context: string = 'Database operation'
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    console.error(`[v0] ${context} failed:`, error)
    return null
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

export default prisma

