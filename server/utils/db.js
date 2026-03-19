import prisma from './prisma.js'

export async function ensureDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to start the server (MySQL)')
  }
  await prisma.$connect()
}

export async function closeDatabaseConnection() {
  await prisma.$disconnect()
}
