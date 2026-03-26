import prisma from './prisma.js'

export async function ensureDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to start the server (PostgreSQL)')
  }
  try {
    const safeUrl = new URL(process.env.DATABASE_URL)
    const maskedPass = safeUrl.password ? '***' : ''
    const safe = `${safeUrl.protocol}//${safeUrl.username}${maskedPass ? `:${maskedPass}` : ''}@${safeUrl.host}${safeUrl.pathname}`
    // eslint-disable-next-line no-console
    console.log('[db] Using DATABASE_URL:', safe)
  } catch {
    // eslint-disable-next-line no-console
    console.log('[db] Using DATABASE_URL (unparsed):', '[redacted]')
  }
  await prisma.$connect()
}

export async function closeDatabaseConnection() {
  await prisma.$disconnect()
}
