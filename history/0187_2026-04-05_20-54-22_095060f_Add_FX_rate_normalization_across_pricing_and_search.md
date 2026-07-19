## Commit Metadata

- **Hash:** 095060fb9198730a32aac4994cdfe23c09311aee
- **Parent:** 0918039fde8c90a374137290fbb598b2ed109c34
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 20:54:22
- **Message:** Add FX rate normalization across pricing and search

## Custom Title

Add FX rate normalization across pricing and search

## High-Level Summary

Add FX rate normalization across pricing and search

11 files changed, 536 insertions(+), 35 deletions(-)

## File-by-File Breakdown

commit 095060fb9198730a32aac4994cdfe23c09311aee
Author: Cyber Code Master <148459541+gamertoky1188gro@users.noreply.github.com>
Date: Sun Apr 5 20:54:22 2026 +0600

    Add FX rate normalization across pricing and search

.../migration.sql | 34 +++
prisma/schema.prisma | 29 +++
server/controllers/productController.js | 36 ++-
server/controllers/requirementController.js | 36 ++-
server/server.js | 6 +
server/services/**tests**/currencyService.test.js | 56 +++++
server/services/analyticsService.js | 33 +--
server/services/currencyService.js | 267 +++++++++++++++++++++
server/services/openSearchService.js | 35 ++-
server/services/productService.js | 20 ++
server/services/requirementService.js | 19 ++
11 files changed, 536 insertions(+), 35 deletions(-)

## Detailed Diff Analysis

```diff
diff --git a/prisma/migrations/20260405120000_add_fx_rates_and_normalized_prices/migration.sql b/prisma/migrations/20260405120000_add_fx_rates_and_normalized_prices/migration.sql
new file mode 100644
index 0000000..581b10f
--- /dev/null
+++ b/prisma/migrations/20260405120000_add_fx_rates_and_normalized_prices/migration.sql
@@ -0,0 +1,34 @@
+-- Add normalized currency columns on core entities
+ALTER TABLE "company_products"
+  ADD COLUMN IF NOT EXISTS "priceOriginal" DOUBLE PRECISION,
+  ADD COLUMN IF NOT EXISTS "currencyOriginal" TEXT,
+  ADD COLUMN IF NOT EXISTS "priceNormalizedBase" DOUBLE PRECISION;
+
+ALTER TABLE "requirements"
+  ADD COLUMN IF NOT EXISTS "priceOriginal" DOUBLE PRECISION,
+  ADD COLUMN IF NOT EXISTS "currencyOriginal" TEXT,
+  ADD COLUMN IF NOT EXISTS "priceNormalizedBase" DOUBLE PRECISION;
+
+-- FX rates cache table
+CREATE TABLE IF NOT EXISTS "fx_rates" (
+  "id" TEXT NOT NULL,
+  "base" TEXT NOT NULL,
+  "quote" TEXT NOT NULL,
+  "rate" DOUBLE PRECISION NOT NULL,
+  "source" TEXT NOT NULL,
+  "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  "expiresAt" TIMESTAMP(3) NOT NULL,
+  CONSTRAINT "fx_rates_pkey" PRIMARY KEY ("id")
+);
+
+CREATE UNIQUE INDEX IF NOT EXISTS "fx_base_quote" ON "fx_rates"("base", "quote");
+CREATE INDEX IF NOT EXISTS "fx_rates_expiresAt_idx" ON "fx_rates"("expiresAt");
+
+-- Optional currency config singleton
+CREATE TABLE IF NOT EXISTS "currency_config" (
+  "id" TEXT NOT NULL DEFAULT 'default',
+  "defaultBaseCurrency" TEXT NOT NULL DEFAULT 'USD',
+  "staleThresholdHours" INTEGER NOT NULL DEFAULT 24,
+  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
+  CONSTRAINT "currency_config_pkey" PRIMARY KEY ("id")
+);
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 065e247..00e6b3e 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -91,6 +91,9 @@ model Requirement {
   quantity               String?
   moq                    String?
   price_range            String?
+  priceOriginal          Float?
+  currencyOriginal       String?
+  priceNormalizedBase    Float?
   material               String?
   fabric_gsm             String?
   timeline_days          String?
@@ -138,6 +141,9 @@ model Product {
   material               String?
   moq                    String?
   price_range            String?
+  priceOriginal          Float?
+  currencyOriginal       String?
+  priceNormalizedBase    Float?
   lead_time_days         String?
   fabric_gsm             String?
   size_range             String?
@@ -163,6 +169,29 @@ model Product {
   @@map("company_products")
 }

+model FxRate {
+  id        String   @id @default(cuid())
+  base      String
+  quote     String
+  rate      Float
+  source    String
+  fetchedAt DateTime @default(now())
+  expiresAt DateTime
+
+  @@unique([base, quote], name: "fx_base_quote")
+  @@index([expiresAt])
+  @@map("fx_rates")
+}
+
+model CurrencyConfig {
+  id                   String @id @default("default")
+  defaultBaseCurrency  String @default("USD")
+  staleThresholdHours  Int    @default(24)
+  updatedAt            DateTime @updatedAt
+
+  @@map("currency_config")
+}
+
 model Message {
   id                String   @id
   match_id          String
diff --git a/server/controllers/productController.js b/server/controllers/productController.js
index c48737e..661b822 100644
--- a/server/controllers/productController.js
+++ b/server/controllers/productController.js
@@ -17,6 +17,7 @@ import { ensureEntitlement } from '../services/entitlementService.js'
 import { getActiveBoostMap } from '../services/boostService.js'
 import { getOrderCertificationMap } from '../services/orderCertificationService.js'
 import { isOpenSearchConfigured, searchOpenSearch } from '../services/openSearchService.js'
+import { getBaseCurrency, normalizeMoney } from '../services/currencyService.js'

 function parseNumber(value) {
   if (value === undefined || value === null) return null
@@ -92,6 +93,14 @@ function rangesOverlap(filterRange, valueRange) {
   return true
 }

+function numberInsideRange(value, rangeRaw) {
+  const range = parseRange(rangeRaw)
+  if (!Number.isFinite(value)) return false
+  if (range.min !== null && value < range.min) return false
+  if (range.max !== null && value > range.max) return false
+  return true
+}
+
 function matchesMoqRange(rawRange, moqValue) {
   if (!rawRange) return true
   const moq = Number.isFinite(Number(moqValue)) ? Number(moqValue) : parseNumber(moqValue)
@@ -317,6 +326,7 @@ export async function searchProducts(req, res) {
   const verifiedOnly = req.query.verifiedOnly === 'true'
   const moqRange = String(req.query.moqRange || '').trim()
   const priceRange = String(req.query.priceRange || '').trim()
+  const priceCurrency = String(req.query.priceCurrency || req.query.currency || '').trim().toUpperCase()
   const wantedCategories = parseList(req.query.category)
   const wantedCertificationsRaw = String(req.query.certifications || '').trim()
   const wantedCertifications = wantedCertificationsRaw
@@ -349,6 +359,19 @@ export async function searchProducts(req, res) {
   const locationLat = parseCoordinate(req.query.locationLat)
   const locationLng = parseCoordinate(req.query.locationLng)
   const distanceFilterActive = distanceKm !== null && locationLat !== null && locationLng !== null
+  const baseCurrency = await getBaseCurrency()
+  let fxStale = false
+  let priceRangeBase = ''
+  if (priceRange) {
+    const parsed = parseRange(priceRange)
+    const fromCurrency = priceCurrency || baseCurrency
+    const minConv = parsed.min === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.min, fromCurrency, baseCurrency)
+    const maxConv = parsed.max === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.max, fromCurrency, baseCurrency)
+    fxStale = Boolean(minConv.fx_stale || maxConv.fx_stale || (parsed.min !== null && minConv.amount === null) || (parsed.max !== null && maxConv.amount === null))
+    const minText = minConv.amount !== null ? String(minConv.amount) : ''
+    const maxText = maxConv.amount !== null ? String(maxConv.amount) : ''
+    priceRangeBase = [minText, maxText].filter((v, idx) => v || idx === 0).join('-')
+  }

   const openSearchReady = await isOpenSearchConfigured()
   const openSearchResult = openSearchReady
@@ -365,7 +388,7 @@ export async function searchProducts(req, res) {
         verifiedOnly,
         category: wantedCategories,
         moqRange,
-        priceRange,
+        priceRangeBase: priceRangeBase || priceRange,
         leadTimeMax,
         gsmMin,
         gsmMax,
@@ -502,7 +525,11 @@ export async function searchProducts(req, res) {
       if (wantedCountry && String(p.author?.country || '').toLowerCase() !== wantedCountry) return false
       if (verifiedOnly && !p.author?.verified) return false
       if (moqRange && !matchesMoqRange(moqRange, p.moq)) return false
-      if (priceRange && !rangesOverlap(priceRange, p.price_range || '')) return false
+      if (priceRangeBase) {
+        if (Number.isFinite(Number(p.priceNormalizedBase))) {
+          if (!numberInsideRange(Number(p.priceNormalizedBase), priceRangeBase)) return false
+        } else if (!rangesOverlap(priceRange, p.price_range || '')) return false
+      }
       if (leadTimeMax !== null) {
         const lead = parseNumber(p.lead_time_days || p.author?.lead_time_days || '')
         if (lead === null || lead > leadTimeMax) return false
@@ -717,6 +744,11 @@ export async function searchProducts(req, res) {
       plan,
       quota: quotaUse.quota,
     }),
+    fx: {
+      base_currency: baseCurrency,
+      filter_currency: priceCurrency || baseCurrency,
+      fx_stale: fxStale,
+    },
   })
 }

diff --git a/server/controllers/requirementController.js b/server/controllers/requirementController.js
index 5cc85b8..bac4649 100644
--- a/server/controllers/requirementController.js
+++ b/server/controllers/requirementController.js
@@ -14,6 +14,7 @@ import { ensureEntitlement } from '../services/entitlementService.js'
 import { generateMatchesForRequirement, listMatchesForRequirement } from '../services/matchingService.js'
 import { getOrderCertificationMap } from '../services/orderCertificationService.js'
 import { isOpenSearchConfigured, searchOpenSearch } from '../services/openSearchService.js'
+import { getBaseCurrency, normalizeMoney } from '../services/currencyService.js'

 function redactRequirementForBuyer(requirement) {
   return {
@@ -118,6 +119,14 @@ function rangesOverlap(filterRange, valueRange) {
   return true
 }

+function numberInsideRange(value, rangeRaw) {
+  const range = parseRange(rangeRaw)
+  if (!Number.isFinite(value)) return false
+  if (range.min !== null && value < range.min) return false
+  if (range.max !== null && value > range.max) return false
+  return true
+}
+
 function matchesMoqRange(rawRange, moqValue) {
   if (!rawRange) return true
   const moq = Number.isFinite(Number(moqValue)) ? Number(moqValue) : parseNumber(moqValue)
@@ -403,6 +412,7 @@ export async function searchRequirements(req, res) {
   const verifiedOnly = req.query.verifiedOnly === 'true'
   const moqRange = String(req.query.moqRange || '').trim()
   const priceRange = String(req.query.priceRange || '').trim()
+  const priceCurrency = String(req.query.priceCurrency || req.query.currency || '').trim().toUpperCase()
   const wantedCategories = parseList(req.query.category)
   const wantedIncoterms = parseList(req.query.incoterms)
   const wantedPaymentTerms = parseList(req.query.paymentTerms)
@@ -435,6 +445,19 @@ export async function searchRequirements(req, res) {
   const locationLat = parseCoordinate(req.query.locationLat)
   const locationLng = parseCoordinate(req.query.locationLng)
   const distanceFilterActive = distanceKm !== null && locationLat !== null && locationLng !== null
+  const baseCurrency = await getBaseCurrency()
+  let fxStale = false
+  let priceRangeBase = ''
+  if (priceRange) {
+    const parsed = parseRange(priceRange)
+    const fromCurrency = priceCurrency || baseCurrency
+    const minConv = parsed.min === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.min, fromCurrency, baseCurrency)
+    const maxConv = parsed.max === null ? { amount: null, fx_stale: false } : await normalizeMoney(parsed.max, fromCurrency, baseCurrency)
+    fxStale = Boolean(minConv.fx_stale || maxConv.fx_stale || (parsed.min !== null && minConv.amount === null) || (parsed.max !== null && maxConv.amount === null))
+    const minText = minConv.amount !== null ? String(minConv.amount) : ''
+    const maxText = maxConv.amount !== null ? String(maxConv.amount) : ''
+    priceRangeBase = [minText, maxText].filter((v, idx) => v || idx === 0).join('-')
+  }

   const openSearchReady = await isOpenSearchConfigured()
   const openSearchResult = openSearchReady
@@ -451,7 +474,7 @@ export async function searchRequirements(req, res) {
         verifiedOnly,
         category: wantedCategories,
         moqRange,
-        priceRange,
+        priceRangeBase: priceRangeBase || priceRange,
         leadTimeMax,
         gsmMin,
         gsmMax,
@@ -581,7 +604,11 @@ export async function searchRequirements(req, res) {
       if (wantedCountry && String(r.author?.country || '').toLowerCase() !== wantedCountry) return false
       if (verifiedOnly && !r.author?.verified) return false
       if (moqRange && !matchesMoqRange(moqRange, r.moq || r.quantity)) return false
-      if (priceRange && !rangesOverlap(priceRange, r.price_range || '')) return false
+      if (priceRangeBase) {
+        if (Number.isFinite(Number(r.priceNormalizedBase))) {
+          if (!numberInsideRange(Number(r.priceNormalizedBase), priceRangeBase)) return false
+        } else if (!rangesOverlap(priceRange, r.price_range || '')) return false
+      }
       if (wantedIncoterms.length > 0) {
         const incoterm = String(r.incoterms || '').toLowerCase()
         const hit = wantedIncoterms.some((term) => incoterm.includes(term))
@@ -807,5 +834,10 @@ export async function searchRequirements(req, res) {
       plan,
       quota: quotaUse.quota,
     }),
+    fx: {
+      base_currency: baseCurrency,
+      filter_currency: priceCurrency || baseCurrency,
+      fx_stale: fxStale,
+    },
   })
 }
diff --git a/server/server.js b/server/server.js
index 99aeca1..ec380af 100644
--- a/server/server.js
+++ b/server/server.js
@@ -60,10 +60,16 @@ import { ensureDatabaseConnection, closeDatabaseConnection } from './utils/db.js
 import { revokeExpiredVerifications } from './services/verificationService.js'
 import { enforcePartnerFreeTierLimits } from './services/partnerNetworkService.js'
 import { runLeadReminderSweep } from './services/leadReminderService.js'
+import { refreshRates } from './services/currencyService.js'

 const app = express()
 const PORT = process.env.PORT || 4000

+const FX_REFRESH_INTERVAL_MS = 60 * 60 * 1000
+setInterval(() => {
+  refreshRates().catch(() => null)
+}, FX_REFRESH_INTERVAL_MS).unref()
+
 app.use(cors())
 app.use(express.json({ limit: '5mb' }))

diff --git a/server/services/__tests__/currencyService.test.js b/server/services/__tests__/currencyService.test.js
new file mode 100644
index 0000000..5543490
--- /dev/null
+++ b/server/services/__tests__/currencyService.test.js
@@ -0,0 +1,56 @@
+import test from 'node:test'
+import assert from 'node:assert/strict'
+import prisma from '../../utils/prisma.js'
+import { getRate, normalizeMoney } from '../currencyService.js'
+
+function withMockedPrisma({ currencyConfig, fxRate, upsertImpl } = {}) {
+  prisma.currencyConfig = {
+    findFirst: async () => currencyConfig || { defaultBaseCurrency: 'USD', staleThresholdHours: 24 },
+  }
+  prisma.fxRate = {
+    findUnique: async () => fxRate || null,
+    upsert: upsertImpl || (async () => null),
+  }
+}
+
+test('normalizeMoney converts from quote currency to base currency using latest FX', async () => {
+  withMockedPrisma({ fxRate: null })
+  const originalFetch = global.fetch
+  global.fetch = async () => ({
+    ok: true,
+    async json() {
+      return { rates: { EUR: 0.8 } }
+    },
+  })
+
+  const converted = await normalizeMoney(80, 'EUR', 'USD')
+  assert.equal(converted.amount, 100)
+  assert.equal(converted.currency_base, 'USD')
+  assert.equal(converted.currency_from, 'EUR')
+  assert.equal(converted.fx_stale, false)
+
+  global.fetch = originalFetch
+})
+
+test('getRate falls back to stale cached rate when provider fails', async () => {
+  withMockedPrisma({
+    fxRate: {
+      rate: 0.9,
+      source: 'cached',
+      fetchedAt: new Date('2026-03-01T00:00:00.000Z'),
+      expiresAt: new Date('2026-03-02T00:00:00.000Z'),
+    },
+  })
+
+  const originalFetch = global.fetch
+  global.fetch = async () => {
+    throw new Error('network_down')
+  }
+
+  const rate = await getRate('USD', 'GBP')
+  assert.equal(rate.rate, 0.9)
+  assert.equal(rate.fx_stale, true)
+  assert.equal(rate.stale, true)
+
+  global.fetch = originalFetch
+})
diff --git a/server/services/analyticsService.js b/server/services/analyticsService.js
index bc9071f..5004dc9 100644
--- a/server/services/analyticsService.js
+++ b/server/services/analyticsService.js
@@ -116,9 +116,9 @@ function safeNumber(value) {
   return Number.isFinite(n) ? n : null
 }

-function bucketPrice(value) {
-  const n = safeNumber(value)
-  if (n === null) return 'unknown'
+function bucketNormalizedPrice(value) {
+  const n = Number(value)
+  if (!Number.isFinite(n) || n < 0) return 'unknown'
   if (n <= 5) return '0-5'
   if (n <= 10) return '5-10'
   if (n <= 20) return '10-20'
@@ -162,29 +162,6 @@ function computeResponseTimesForOrg(messages = [], orgMemberIds = new Set()) {
   return { avg_hours: avg, formatted: formatHours(avg) }
 }

-function parseNumericRange(value) {
-  const raw = String(value || '')
-  if (!raw) return { min: null, max: null }
-  const matches = raw.match(/\d+(\.\d+)?/g)
-  if (!matches || matches.length === 0) return { min: null, max: null }
-  const nums = matches.map((n) => Number(n)).filter((n) => Number.isFinite(n))
-  if (!nums.length) return { min: null, max: null }
-  const min = nums[0] ?? null
-  const max = nums[1] ?? nums[0] ?? null
-  return { min, max }
-}
-
-function bucketPriceRange(value) {
-  const { min, max } = parseNumericRange(value)
-  const ref = min ?? max
-  if (ref === null || !Number.isFinite(ref)) return 'unknown'
-  if (ref <= 5) return '0-5'
-  if (ref <= 10) return '5-10'
-  if (ref <= 20) return '10-20'
-  if (ref <= 50) return '20-50'
-  return '50+'
-}
-
 export async function getDashboardAnalytics(user) {
   ensureAnalyticsDashboardAccess(user)

@@ -634,7 +611,7 @@ export async function getPlatformAnalytics(user) {
     byCountry[country][category] = (byCountry[country][category] || 0) + 1
     globalCategories[category] = (globalCategories[category] || 0) + 1

-    const bucket = bucketPriceRange(req.price_range || req.priceRange || '')
+    const bucket = bucketNormalizedPrice(req.priceNormalizedBase)
     priceBuckets[bucket] = (priceBuckets[bucket] || 0) + 1
   }

@@ -801,7 +778,7 @@ export async function getPremiumInsights(user) {
     }, {})

     const priceBuckets = myRequests.reduce((acc, r) => {
-      const bucket = bucketPrice(r.price_range || '')
+      const bucket = bucketNormalizedPrice(r.priceNormalizedBase)
       acc[bucket] = (acc[bucket] || 0) + 1
       return acc
     }, {})
diff --git a/server/services/currencyService.js b/server/services/currencyService.js
new file mode 100644
index 0000000..2c88d35
--- /dev/null
+++ b/server/services/currencyService.js
@@ -0,0 +1,267 @@
+import prisma from '../utils/prisma.js'
+import { readJson } from '../utils/jsonStore.js'
+
+const DEFAULT_BASE = 'USD'
+const DEFAULT_STALE_HOURS = 24
+const FX_SOURCE = 'frankfurter'
+const HTTP_TIMEOUT_MS = 5000
+
+const memoryRates = new Map()
+
+function nowIso() {
+  return new Date().toISOString()
+}
+
+function toCurrency(code, fallback = DEFAULT_BASE) {
+  const raw = String(code || fallback).trim().toUpperCase()
+  return raw || fallback
+}
+
+function parseNumberish(value) {
+  if (value === undefined || value === null) return null
+  const n = Number(String(value).replace(/[^\d.-]/g, ''))
+  return Number.isFinite(n) ? n : null
+}
+
+function parseFirstAmount(value) {
+  const raw = String(value || '')
+  const match = raw.match(/\d+(\.\d+)?/)
+  if (!match) return null
+  const n = Number(match[0])
+  return Number.isFinite(n) ? n : null
+}
+
+function isFuture(iso) {
+  const ts = new Date(iso || '').getTime()
+  return Number.isFinite(ts) && ts > Date.now()
+}
+
+async function getCurrencyConfig() {
+  try {
+    const row = await prisma.currencyConfig.findFirst()
+    return {
+      defaultBaseCurrency: toCurrency(row?.defaultBaseCurrency, DEFAULT_BASE),
+      staleThresholdHours: Math.max(1, Number(row?.staleThresholdHours || DEFAULT_STALE_HOURS)),
+    }
+  } catch {
+    return {
+      defaultBaseCurrency: DEFAULT_BASE,
+      staleThresholdHours: DEFAULT_STALE_HOURS,
+    }
+  }
+}
+
+function memoryKey(base, quote) {
+  return `${base}:${quote}`
+}
+
+async function readCachedRate(base, quote) {
+  const key = memoryKey(base, quote)
+  if (memoryRates.has(key)) return memoryRates.get(key)
+
+  try {
+    const row = await prisma.fxRate.findUnique({
+      where: {
+        fx_base_quote: { base, quote },
+      },
+    })
+    if (!row) return null
+    const cached = {
+      base,
+      quote,
+      rate: Number(row.rate),
+      source: String(row.source || 'cached'),
+      fetchedAt: row.fetchedAt?.toISOString?.() || row.fetchedAt,
+      expiresAt: row.expiresAt?.toISOString?.() || row.expiresAt,
+      stale: !isFuture(row.expiresAt),
+    }
+    memoryRates.set(key, cached)
+    return cached
+  } catch {
+    return null
+  }
+}
+
+async function persistRate(base, quote, rate, source, staleHours) {
+  const fetchedAt = new Date()
+  const expiresAt = new Date(fetchedAt.getTime() + staleHours * 60 * 60 * 1000)
+  const payload = {
+    base,
+    quote,
+    rate,
+    source,
+    fetchedAt,
+    expiresAt,
+  }
+  memoryRates.set(memoryKey(base, quote), {
+    ...payload,
+    fetchedAt: fetchedAt.toISOString(),
+    expiresAt: expiresAt.toISOString(),
+    stale: false,
+  })
+
+  try {
+    await prisma.fxRate.upsert({
+      where: { fx_base_quote: { base, quote } },
+      update: payload,
+      create: payload,
+    })
+  } catch {
+    // DB failures should not break reads; memory cache still works for the current process.
+  }
+
+  return {
+    base,
+    quote,
+    rate,
+    source,
+    fetchedAt: fetchedAt.toISOString(),
+    expiresAt: expiresAt.toISOString(),
+    stale: false,
+  }
+}
+
+async function fetchLiveRate(base, quote, staleHours) {
+  const ctrl = new AbortController()
+  const timeout = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS)
+  try {
+    const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}&to=${encodeURIComponent(quote)}`
+    const response = await fetch(url, { signal: ctrl.signal })
+    if (!response.ok) throw new Error(`fx_http_${response.status}`)
+    const json = await response.json()
+    const rate = Number(json?.rates?.[quote])
+    if (!Number.isFinite(rate) || rate <= 0) throw new Error('fx_rate_invalid')
+    return persistRate(base, quote, rate, FX_SOURCE, staleHours)
+  } finally {
+    clearTimeout(timeout)
+  }
+}
+
+export async function getRate(base, quote, options = {}) {
+  const normalizedBase = toCurrency(base)
+  const normalizedQuote = toCurrency(quote)
+  if (normalizedBase === normalizedQuote) {
+    return {
+      base: normalizedBase,
+      quote: normalizedQuote,
+      rate: 1,
+      source: 'identity',
+      fetchedAt: nowIso(),
+      expiresAt: null,
+      stale: false,
+      fx_stale: false,
+    }
+  }
+
+  const cfg = await getCurrencyConfig()
+  const staleHours = Math.max(1, Number(options.staleThresholdHours || cfg.staleThresholdHours || DEFAULT_STALE_HOURS))
+
+  const cached = await readCachedRate(normalizedBase, normalizedQuote)
+  if (cached && !cached.stale) return { ...cached, fx_stale: false }
+
+  try {
+    return await fetchLiveRate(normalizedBase, normalizedQuote, staleHours)
+  } catch {
+    if (cached) {
+      return {
+        ...cached,
+        stale: true,
+        fx_stale: true,
+      }
+    }
+    return null
+  }
+}
+
+export async function normalizeMoney(amount, from, toBase) {
+  const value = parseNumberish(amount)
+  if (!Number.isFinite(value)) {
+    return { amount: null, rate: null, currency_from: toCurrency(from), currency_base: toCurrency(toBase), fx_stale: false }
+  }
+
+  const fromCurrency = toCurrency(from)
+  const baseCurrency = toCurrency(toBase)
+  if (fromCurrency === baseCurrency) {
+    return {
+      amount: Math.round(value * 10000) / 10000,
+      rate: 1,
+      currency_from: fromCurrency,
+      currency_base: baseCurrency,
+      fx_stale: false,
+    }
+  }
+
+  const rateEntry = await getRate(baseCurrency, fromCurrency)
+  if (!rateEntry || !Number.isFinite(Number(rateEntry.rate)) || Number(rateEntry.rate) <= 0) {
+    return {
+      amount: null,
+      rate: null,
+      currency_from: fromCurrency,
+      currency_base: baseCurrency,
+      fx_stale: true,
+    }
+  }
+
+  const converted = value / Number(rateEntry.rate)
+  return {
+    amount: Math.round(converted * 10000) / 10000,
+    rate: Number(rateEntry.rate),
+    currency_from: fromCurrency,
+    currency_base: baseCurrency,
+    fx_stale: Boolean(rateEntry.fx_stale || rateEntry.stale),
+  }
+}
+
+export async function getBaseCurrency() {
+  const cfg = await getCurrencyConfig()
+  return toCurrency(cfg.defaultBaseCurrency, DEFAULT_BASE)
+}
+
+export function extractOriginalPrice(payload = {}) {
+  const currency = toCurrency(payload.currencyOriginal || payload.currency || payload.currency_original || DEFAULT_BASE)
+  const direct = parseNumberish(payload.priceOriginal ?? payload.price)
+  if (Number.isFinite(direct)) {
+    return { priceOriginal: direct, currencyOriginal: currency }
+  }
+
+  const parsed = parseFirstAmount(payload.price_range || payload.priceRange || payload.target_price || payload.target_fob_price)
+  return {
+    priceOriginal: Number.isFinite(parsed) ? parsed : null,
+    currencyOriginal: currency,
+  }
+}
+
+export async function refreshRates() {
+  const base = await getBaseCurrency()
+  const [products, requirements] = await Promise.all([
+    readJson('company_products.json'),
+    readJson('requirements.json'),
+  ])
+
+  const currencies = new Set([base])
+  ;[...(Array.isArray(products) ? products : []), ...(Array.isArray(requirements) ? requirements : [])].forEach((row) => {
+    const code = toCurrency(row?.currencyOriginal || row?.currency || row?.currency_original || '')
+    if (code) currencies.add(code)
+  })
+
+  const targets = [...currencies].filter((code) => code && code !== base)
+  const refreshed = []
+  let fx_stale = false
+
+  for (const quote of targets) {
+    const entry = await getRate(base, quote)
+    if (!entry) {
+      fx_stale = true
+      continue
+    }
+    if (entry.fx_stale || entry.stale) fx_stale = true
+    refreshed.push({ quote, rate: entry.rate, stale: Boolean(entry.fx_stale || entry.stale) })
+  }
+
+  return {
+    base,
+    refreshed_count: refreshed.length,
+    refreshed,
+    fx_stale,
+  }
+}
diff --git a/server/services/openSearchService.js b/server/services/openSearchService.js
index ef18616..a672d95 100644
--- a/server/services/openSearchService.js
+++ b/server/services/openSearchService.js
@@ -1,6 +1,7 @@
 import { Client } from '@opensearch-project/opensearch'
 import { getAdminConfig } from './adminConfigService.js'
 import { readJson } from '../utils/jsonStore.js'
+import { getBaseCurrency, normalizeMoney } from './currencyService.js'

 const CONFIG_TTL_MS = 15000
 const RESPONSE_CACHE_TTL_MS = 10 * 60 * 1000
@@ -151,6 +152,9 @@ function productMappings() {
       moq_value: { type: 'double' },
       price_min: { type: 'double' },
       price_max: { type: 'double' },
+      price_base_min: { type: 'double' },
+      price_base_max: { type: 'double' },
+      base_currency: { type: 'keyword' },
       lead_time_days: { type: 'double' },
       fabric_gsm: { type: 'double' },
       created_at: { type: 'date' },
@@ -192,6 +196,9 @@ function requirementMappings() {
       moq_value: { type: 'double' },
       price_min: { type: 'double' },
       price_max: { type: 'double' },
+      price_base_min: { type: 'double' },
+      price_base_max: { type: 'double' },
+      base_currency: { type: 'keyword' },
       lead_time_days: { type: 'double' },
       fabric_gsm: { type: 'double' },
       created_at: { type: 'date' },
@@ -315,6 +322,14 @@ async function buildResponseTimeByOwner() {

 async function buildProductDoc(product, author = {}, responseMap = null) {
   const priceRange = parseRangeValue(product.price_range || '')
+  const baseCurrency = await getBaseCurrency()
+  const originalCurrency = normalizeKeyword(product.currencyOriginal || product.currency || baseCurrency).toUpperCase()
+  const priceBaseMin = priceRange.min !== null
+    ? (await normalizeMoney(priceRange.min, originalCurrency, baseCurrency)).amount
+    : (Number.isFinite(Number(product.priceNormalizedBase)) ? Number(product.priceNormalizedBase) : null)
+  const priceBaseMax = priceRange.max !== null
+    ? (await normalizeMoney(priceRange.max, originalCurrency, baseCurrency)).amount
+    : (Number.isFinite(Number(product.priceNormalizedBase)) ? Number(product.priceNormalizedBase) : null)
   const moqValue = parseNumberLike(product.moq)
   const leadTime = parseNumberLike(product.lead_time_days || author.lead_time_days)
   const fabricGsm = parseNumberLike(product.fabric_gsm)
@@ -342,6 +357,9 @@ async function buildProductDoc(product, author = {}, responseMap = null) {
     moq_value: moqValue,
     price_min: priceRange.min,
     price_max: priceRange.max,
+    price_base_min: priceBaseMin,
+    price_base_max: priceBaseMax,
+    base_currency: baseCurrency,
     lead_time_days: leadTime,
     fabric_gsm: fabricGsm,
     created_at: product.created_at || new Date().toISOString(),
@@ -374,6 +392,14 @@ function shouldIndexProduct(product) {

 async function buildRequirementDoc(req, author = {}, responseMap = null) {
   const priceRange = parseRangeValue(req.price_range || req.target_price || '')
+  const baseCurrency = await getBaseCurrency()
+  const originalCurrency = normalizeKeyword(req.currencyOriginal || req.currency || baseCurrency).toUpperCase()
+  const priceBaseMin = priceRange.min !== null
+    ? (await normalizeMoney(priceRange.min, originalCurrency, baseCurrency)).amount
+    : (Number.isFinite(Number(req.priceNormalizedBase)) ? Number(req.priceNormalizedBase) : null)
+  const priceBaseMax = priceRange.max !== null
+    ? (await normalizeMoney(priceRange.max, originalCurrency, baseCurrency)).amount
+    : (Number.isFinite(Number(req.priceNormalizedBase)) ? Number(req.priceNormalizedBase) : null)
   const moqValue = parseNumberLike(req.moq || req.quantity)
   const leadTime = parseNumberLike(req.timeline_days || req.delivery_timeline || '')
   const fabricGsm = parseNumberLike(req.fabric_gsm)
@@ -403,6 +429,9 @@ async function buildRequirementDoc(req, author = {}, responseMap = null) {
     moq_value: moqValue,
     price_min: priceRange.min,
     price_max: priceRange.max,
+    price_base_min: priceBaseMin,
+    price_base_max: priceBaseMax,
+    base_currency: baseCurrency,
     lead_time_days: leadTime,
     fabric_gsm: fabricGsm,
     created_at: req.created_at || new Date().toISOString(),
@@ -568,9 +597,9 @@ export async function searchOpenSearch({
   const moqFilter = buildRangeFilter('moq_value', moqRange)
   if (moqFilter) filter.push(moqFilter)

-  const priceRange = parseRangeValue(filters.priceRange)
-  const priceMinFilter = buildRangeFilter('price_min', priceRange)
-  const priceMaxFilter = buildRangeFilter('price_max', priceRange)
+  const priceRange = parseRangeValue(filters.priceRangeBase || filters.priceRange)
+  const priceMinFilter = buildRangeFilter('price_base_min', priceRange)
+  const priceMaxFilter = buildRangeFilter('price_base_max', priceRange)
   if (priceMinFilter) filter.push(priceMinFilter)
   if (priceMaxFilter) filter.push(priceMaxFilter)

diff --git a/server/services/productService.js b/server/services/productService.js
index 6979be2..dad5eb8 100644
--- a/server/services/productService.js
+++ b/server/services/productService.js
@@ -8,6 +8,7 @@ import { isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
 import { getAdminConfig } from './adminConfigService.js'
 import { getPlanForUser } from './entitlementService.js'
 import { indexProduct, deleteProductIndex } from './openSearchService.js'
+import { extractOriginalPrice, getBaseCurrency, normalizeMoney } from './currencyService.js'

 const FILE = 'company_products.json'
 const PROHIBITED_MEDIA_KEYWORDS = ['porn', 'explicit', 'nudity', 'violence', 'weapon', 'drugs', 'hate']
@@ -428,6 +429,13 @@ export async function createProduct(user, payload) {
     created_at: new Date().toISOString(),
   }

+  const baseCurrency = await getBaseCurrency()
+  const originalPrice = extractOriginalPrice(payload)
+  const normalizedPrice = await normalizeMoney(originalPrice.priceOriginal, originalPrice.currencyOriginal, baseCurrency)
+  row.priceOriginal = originalPrice.priceOriginal
+  row.currencyOriginal = originalPrice.currencyOriginal
+  row.priceNormalizedBase = normalizedPrice.amount
+
   // Trust & safety (project.md): strip outside-contact sharing / obscene content from descriptions.
   try {
     const moderated = await moderateTextOrRedact({
@@ -601,6 +609,18 @@ export async function updateProductById(actor, productId, patch = {}) {
     updated_at: new Date().toISOString(),
   }

+  const baseCurrency = await getBaseCurrency()
+  const originalPrice = extractOriginalPrice({
+    priceOriginal: patch.priceOriginal !== undefined ? patch.priceOriginal : existing.priceOriginal,
+    currencyOriginal: patch.currencyOriginal !== undefined ? patch.currencyOriginal : existing.currencyOriginal,
+    currency: patch.currency !== undefined ? patch.currency : existing.currencyOriginal,
+    price_range: next.price_range,
+  })
+  const normalizedPrice = await normalizeMoney(originalPrice.priceOriginal, originalPrice.currencyOriginal, baseCurrency)
+  next.priceOriginal = originalPrice.priceOriginal
+  next.currencyOriginal = originalPrice.currencyOriginal
+  next.priceNormalizedBase = normalizedPrice.amount
+
   all[idx] = next
   await writeJson(FILE, all)
   try {
diff --git a/server/services/requirementService.js b/server/services/requirementService.js
index eb831f6..1100931 100644
--- a/server/services/requirementService.js
+++ b/server/services/requirementService.js
@@ -7,6 +7,7 @@ import { recordMilestone } from './ratingsService.js'
 import { moderateTextOrRedact } from './policyService.js'
 import { getPlanForUser } from './entitlementService.js'
 import { indexRequirement, deleteRequirementIndex } from './openSearchService.js'
+import { extractOriginalPrice, getBaseCurrency, normalizeMoney } from './currencyService.js'

 const FILE = 'requirements.json'

@@ -238,6 +239,12 @@ function normalizeRequirement(buyerId, payload) {
 export async function createRequirement(buyerId, payload) {
   const requirements = await readJson(FILE)
   const requirement = normalizeRequirement(buyerId, payload)
+  const baseCurrency = await getBaseCurrency()
+  const originalPrice = extractOriginalPrice(payload)
+  const normalizedPrice = await normalizeMoney(originalPrice.priceOriginal, originalPrice.currencyOriginal, baseCurrency)
+  requirement.priceOriginal = originalPrice.priceOriginal
+  requirement.currencyOriginal = originalPrice.currencyOriginal
+  requirement.priceNormalizedBase = normalizedPrice.amount
   const plan = await getPlanForUser({ id: buyerId })
   if (plan === 'premium') {
     requirement.priority_tier = 'priority'
@@ -399,6 +406,18 @@ export async function updateRequirement(requirementId, patch, actor) {
     priority_until: patch.priority_until !== undefined ? normalizeDate(patch.priority_until) : (previous.priority_until || null),
   }

+  const baseCurrency = await getBaseCurrency()
+  const originalPrice = extractOriginalPrice({
+    priceOriginal: patch.priceOriginal !== undefined ? patch.priceOriginal : previous.priceOriginal,
+    currencyOriginal: patch.currencyOriginal !== undefined ? patch.currencyOriginal : previous.currencyOriginal,
+    currency: patch.currency !== undefined ? patch.currency : previous.currencyOriginal,
+    price_range: next.price_range,
+  })
+  const normalizedPrice = await normalizeMoney(originalPrice.priceOriginal, originalPrice.currencyOriginal, baseCurrency)
+  next.priceOriginal = originalPrice.priceOriginal
+  next.currencyOriginal = originalPrice.currencyOriginal
+  next.priceNormalizedBase = normalizedPrice.amount
+
   assertRequiredFields({
     ...next,
     ...next.specs,
```

## Why This Change

Add FX rate normalization across pricing and search

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 11 files changed, 536 insertions(+), 35 deletions(-)
- **Risk:** Moderate

## Relationships

Commit 187 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
