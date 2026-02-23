let prisma: any = null

try {
  const { PrismaClient } = require('@prisma/client')
  const globalForPrisma = (global as any) || {}

  prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
} catch (error) {
  console.warn('[v0] Prisma client not available - run: npx prisma generate')
  prisma = null
}

export { prisma }

export async function runWithErrorHandling<T>(
  fn: () => Promise<T>,
  context: string = 'Database operation'
): Promise<T | null> {
  try {
    if (!prisma) {
      console.warn(`[v0] ${context}: Prisma not initialized`)
      return null
    }
    return await fn()
  } catch (error) {
    console.error(`[v0] ${context} failed:`, error)
    return null
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (!prisma) return false
    return true
  } catch {
    return false
  }
}

export default prisma

