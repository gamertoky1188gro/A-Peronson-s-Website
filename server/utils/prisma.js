import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma = globalForPrisma.__gartex_prisma__ || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__gartex_prisma__ = prisma
}

export default prisma
