// Keystone context disabled - prevents Prisma initialization during build
// import { getContext } from '@keystone-6/core/context'
// import config from './index'
import { type Context } from '.keystone/types'
// import * as PrismaModule from "@prisma/client";

// TODO: Enable after DATABASE_URL is configured
// Making sure multiple prisma clients are not created during hot reloading
export const keystoneContext: Context = {} as any

// if (process.env.NODE_ENV !== 'production') {
//   (globalThis as any).keystoneContext = keystoneContext
// }
