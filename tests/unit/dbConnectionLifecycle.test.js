/** @jest-environment node */

import prisma from '../../server/utils/prisma.js'
import {
  closeDatabaseConnection,
  ensureDatabaseConnection,
  getDbStatus,
} from '../../server/utils/db.js'

describe('db connection lifecycle', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL
  const originalConnect = prisma.$connect
  const originalDisconnect = prisma.$disconnect

  afterEach(() => {
    process.env.DATABASE_URL = originalDatabaseUrl
    prisma.$connect = originalConnect
    prisma.$disconnect = originalDisconnect
  })

  test('fails startup path when DATABASE_URL is missing', async () => {
    delete process.env.DATABASE_URL
    prisma.$connect = async () => undefined

    await expect(ensureDatabaseConnection()).rejects.toThrow('DATABASE_URL is required to start the server (PostgreSQL)')

    const status = getDbStatus()
    expect(status.connected).toBe(false)
    expect(status.error).toMatch(/DATABASE_URL is required/)
  })

  test('records connect failure error status', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/meow'
    prisma.$connect = async () => {
      throw new Error('connect_failed')
    }

    await expect(ensureDatabaseConnection()).rejects.toThrow('connect_failed')

    const status = getDbStatus()
    expect(status.connected).toBe(false)
    expect(status.error).toBe('connect_failed')
  })

  test('connects then disconnects cleanly', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/meow'
    prisma.$connect = async () => undefined
    prisma.$disconnect = async () => undefined

    await expect(ensureDatabaseConnection()).resolves.toBeUndefined()
    let status = getDbStatus()
    expect(status.connected).toBe(true)
    expect(status.error).toBe('')

    await expect(closeDatabaseConnection()).resolves.toBeUndefined()
    status = getDbStatus()
    expect(status.connected).toBe(false)
  })
})
