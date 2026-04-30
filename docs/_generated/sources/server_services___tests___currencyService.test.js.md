    1 | import test from 'node:test'
    2 | import assert from 'node:assert/strict'
    3 | import prisma from '../../utils/prisma.js'
    4 | import { getRate, normalizeMoney } from '../currencyService.js'
    5 | 
    6 | function withMockedPrisma({ currencyConfig, fxRate, upsertImpl } = {}) {
    7 |   prisma.currencyConfig = {
    8 |     findFirst: async () => currencyConfig || { baseCurrency: 'USD', staleToleranceMinutes: 1440 },
    9 |   }
   10 |   prisma.fxRate = {
   11 |     findUnique: async () => fxRate || null,
   12 |     upsert: upsertImpl || (async () => null),
   13 |   }
   14 | }
   15 | 
   16 | test('normalizeMoney converts from quote currency to base currency using live FX', async () => {
   17 |   withMockedPrisma({ fxRate: null })
   18 |   const originalFetch = global.fetch
   19 |   global.fetch = async () => ({
   20 |     ok: true,
   21 |     async json() {
   22 |       return { rates: { EUR: 0.8 } }
   23 |     },
   24 |   })
   25 | 
   26 |   const converted = await normalizeMoney(80, 'EUR', 'USD')
   27 |   assert.equal(converted.amount, 100)
   28 |   assert.equal(converted.currency_base, 'USD')
   29 |   assert.equal(converted.currency_from, 'EUR')
   30 |   assert.equal(converted.fx_stale, false)
   31 |   assert.equal(converted.warning, null)
   32 | 
   33 |   global.fetch = originalFetch
   34 | })
   35 | 
   36 | test('getRate marks cached entry stale when expired', async () => {
   37 |   withMockedPrisma({
   38 |     fxRate: {
   39 |       rate: 0.92,
   40 |       source: 'cached',
   41 |       fetchedAt: new Date('2026-03-01T00:00:00.000Z'),
   42 |       expiresAt: new Date('2026-03-02T00:00:00.000Z'),
   43 |     },
   44 |   })
   45 | 
   46 |   const originalFetch = global.fetch
   47 |   global.fetch = async () => {
   48 |     throw new Error('provider_down')
   49 |   }
   50 | 
   51 |   const rate = await getRate('USD', 'GBP')
   52 |   assert.equal(rate.rate, 0.92)
   53 |   assert.equal(rate.fx_stale, true)
   54 |   assert.equal(rate.stale, true)
   55 |   assert.equal(rate.warning?.code, 'fx_provider_unavailable_stale_rate')
   56 | 
   57 |   global.fetch = originalFetch
   58 | })
   59 | 
   60 | test('normalizeMoney returns unavailable warning when no cache and provider fails', async () => {
   61 |   withMockedPrisma({ fxRate: null })
   62 | 
   63 |   const originalFetch = global.fetch
   64 |   global.fetch = async () => {
   65 |     throw new Error('network_down')
   66 |   }
   67 | 
   68 |   const converted = await normalizeMoney(50, 'NOK', 'USD')
   69 |   assert.equal(converted.amount, null)
   70 |   assert.equal(converted.fx_stale, true)
   71 |   assert.equal(converted.warning?.code, 'fx_rate_unavailable')
   72 | 
   73 |   global.fetch = originalFetch
   74 | })
   75 | 