import prisma from './prisma.js'

let dbConnected = false
let dbError = ''

export function getDbStatus() {
  return {
    connected: dbConnected,
    error: dbError,
  }
}

export async function ensureDatabaseConnection() {
  const allowOffline = ['1', 'true', 'yes'].includes(String(process.env.ALLOW_DB_OFFLINE || '').toLowerCase())
  if (!process.env.DATABASE_URL) {
    if (allowOffline) {
      dbConnected = false
      dbError = 'DATABASE_URL missing (offline mode allowed)'
      console.warn('[db] DATABASE_URL missing; continuing in offline mode.')
      return
    }
    dbConnected = false
    dbError = 'DATABASE_URL is required to start the server (PostgreSQL)'
    throw new Error(dbError)
  }
  try {
    const safeUrl = new URL(process.env.DATABASE_URL)
    const maskedPass = safeUrl.password ? '***' : ''
    const safe = `${safeUrl.protocol}//${safeUrl.username}${maskedPass ? `:${maskedPass}` : ''}@${safeUrl.host}${safeUrl.pathname}`
    console.log('[db] Using DATABASE_URL:', safe)
  } catch {
    console.log('[db] Using DATABASE_URL (unparsed):', '[redacted]')
  }
  try {
    await prisma.$connect()
    dbConnected = true
    dbError = ''
  } catch (error) {
    dbConnected = false
    dbError = error?.message || 'DB connection failed'
    if (allowOffline) {
      console.warn('[db] Failed to connect; continuing in offline mode:', dbError)
      return
    }
    throw error
  }
}

export async function closeDatabaseConnection() {
  await prisma.$disconnect()
  dbConnected = false
}
