// Database stub - Prisma disabled for now
// When DATABASE_URL is properly configured and schema is generated, uncomment the PrismaClient below

// TODO: Enable when database schema is ready
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

// For now, provide stub functions that allow the app to run
export const prisma = {
  $disconnect: async () => {},
  $queryRaw: async () => null,
} as any

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
  console.log('[v0] Database connection check skipped (Prisma disabled)')
  return true
}

export default prisma
