import prismaClientPkg from '@prisma/client'

let prisma

// Guard: when running unit tests we prefer a lightweight stub so
// the real Prisma client (which can include browser-built bundles)
// does not attempt to initialize. Tests commonly stub delegate
// properties (e.g. `prisma.appState = { ... }`) so an empty object
// suffices in `test` mode.
if (process.env.NODE_ENV === 'test') {
  prisma = {}
} else {
  const PrismaClient = prismaClientPkg?.PrismaClient ?? prismaClientPkg?.default?.PrismaClient
  const globalForPrisma = globalThis
  prisma = globalForPrisma.__gartex_prisma__ || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__gartex_prisma__ = prisma
  }
}

export default prisma
