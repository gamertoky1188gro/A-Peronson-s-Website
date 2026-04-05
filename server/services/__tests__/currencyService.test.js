import test from 'node:test'
import assert from 'node:assert/strict'
import prisma from '../../utils/prisma.js'
import { getRate, normalizeMoney } from '../currencyService.js'

function withMockedPrisma({ currencyConfig, fxRate, upsertImpl } = {}) {
  prisma.currencyConfig = {
    findFirst: async () => currencyConfig || { defaultBaseCurrency: 'USD', staleThresholdHours: 24 },
  }
  prisma.fxRate = {
    findUnique: async () => fxRate || null,
    upsert: upsertImpl || (async () => null),
  }
}

test('normalizeMoney converts from quote currency to base currency using latest FX', async () => {
  withMockedPrisma({ fxRate: null })
  const originalFetch = global.fetch
  global.fetch = async () => ({
    ok: true,
    async json() {
      return { rates: { EUR: 0.8 } }
    },
  })

  const converted = await normalizeMoney(80, 'EUR', 'USD')
  assert.equal(converted.amount, 100)
  assert.equal(converted.currency_base, 'USD')
  assert.equal(converted.currency_from, 'EUR')
  assert.equal(converted.fx_stale, false)

  global.fetch = originalFetch
})

test('getRate falls back to stale cached rate when provider fails', async () => {
  withMockedPrisma({
    fxRate: {
      rate: 0.9,
      source: 'cached',
      fetchedAt: new Date('2026-03-01T00:00:00.000Z'),
      expiresAt: new Date('2026-03-02T00:00:00.000Z'),
    },
  })

  const originalFetch = global.fetch
  global.fetch = async () => {
    throw new Error('network_down')
  }

  const rate = await getRate('USD', 'GBP')
  assert.equal(rate.rate, 0.9)
  assert.equal(rate.fx_stale, true)
  assert.equal(rate.stale, true)

  global.fetch = originalFetch
})
