## Commit Metadata
- **Hash:** 087fa7841c27fe619be75046a0ec0a06f63a86eb
- **Parent:** 6001ca352351de033f851843145bd175af9e2df3
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 22:21:32
- **Message:** Implement normalized FX pricing pipeline and stale-rate telemetry

## Custom Title
Implement normalized FX pricing pipeline and stale-rate telemetry

## High-Level Summary
Implement normalized FX pricing pipeline and stale-rate telemetry

 10 files changed, 286 insertions(+), 122 deletions(-)

## File-by-File Breakdown
commit 087fa7841c27fe619be75046a0ec0a06f63a86eb
Author: Cyber Code Master <148459541+gamertoky1188gro@users.noreply.github.com>
Date:   Sun Apr 5 22:21:32 2026 +0600

    Implement normalized FX pricing pipeline and stale-rate telemetry

 prisma/schema.prisma                              |  22 ++-
 server/controllers/productController.js           |   7 +-
 server/controllers/requirementController.js       |   7 +-
 server/server.js                                  |   9 +-
 server/services/__tests__/currencyService.test.js |  30 +++-
 server/services/analyticsService.js               |  13 +-
 server/services/currencyService.js                | 202 ++++++++++++++++------
 server/services/openSearchService.js              |  40 ++---
 server/services/productService.js                 |  39 +++--
 server/services/requirementService.js             |  39 +++--
 10 files changed, 286 insertions(+), 122 deletions(-)

## Detailed Diff Analysis
```diff
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 0c5832a..aea6bdc 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -99,8 +99,11 @@ model Requirement {
   quantity               String?
   moq                    String?
   price_range            String?
-  priceOriginal          Float?
-  currencyOriginal       String?
+  currency               String?
+  priceOriginalMin       Float?
+  priceOriginalMax       Float?
+  priceBaseMin           Float?
+  priceBaseMax           Float?
   priceNormalizedBase    Float?
   material               String?
   fabric_gsm             String?
@@ -149,8 +152,11 @@ model Product {
   material               String?
   moq                    String?
   price_range            String?
-  priceOriginal          Float?
-  currencyOriginal       String?
+  currency               String?
+  priceOriginalMin       Float?
+  priceOriginalMax       Float?
+  priceBaseMin           Float?
+  priceBaseMax           Float?
   priceNormalizedBase    Float?
   lead_time_days         String?
   fabric_gsm             String?
@@ -192,10 +198,10 @@ model FxRate {
 }
 
 model CurrencyConfig {
-  id                   String @id @default("default")
-  defaultBaseCurrency  String @default("USD")
-  staleThresholdHours  Int    @default(24)
-  updatedAt            DateTime @updatedAt
+  id                     String   @id @default("default")
+  baseCurrency           String   @default("USD")
+  staleToleranceMinutes  Int      @default(1440)
+  updatedAt              DateTime @updatedAt
 
   @@map("currency_config")
 }
diff --git a/server/controllers/productController.js b/server/controllers/productController.js
index 661b822..0ffb3c1 100644
--- a/server/controllers/productController.js
+++ b/server/controllers/productController.js
@@ -526,8 +526,11 @@ export async function searchProducts(req, res) {
       if (verifiedOnly && !p.author?.verified) return false
       if (moqRange && !matchesMoqRange(moqRange, p.moq)) return false
       if (priceRangeBase) {
-        if (Number.isFinite(Number(p.priceNormalizedBase))) {
-          if (!numberInsideRange(Number(p.priceNormalizedBase), priceRangeBase)) return false
+        const normalizedMin = Number.isFinite(Number(p.priceBaseMin)) ? Number(p.priceBaseMin) : Number(p.priceNormalizedBase)
+        const normalizedMax = Number.isFinite(Number(p.priceBaseMax)) ? Number(p.priceBaseMax) : Number(p.priceNormalizedBase)
+        if (Number.isFinite(normalizedMin) || Number.isFinite(normalizedMax)) {
+          const synthetic = `${Number.isFinite(normalizedMin) ? normalizedMin : ''}-${Number.isFinite(normalizedMax) ? normalizedMax : ''}`
+          if (!rangesOverlap(priceRangeBase, synthetic)) return false
         } else if (!rangesOverlap(priceRange, p.price_range || '')) return false
       }
       if (leadTimeMax !== null) {
diff --git a/server/controllers/requirementController.js b/server/controllers/requirementController.js
index bac4649..b477437 100644
--- a/server/controllers/requirementController.js
+++ b/server/controllers/requirementController.js
@@ -605,8 +605,11 @@ export async function searchRequirements(req, res) {
       if (verifiedOnly && !r.author?.verified) return false
       if (moqRange && !matchesMoqRange(moqRange, r.moq || r.quantity)) return false
       if (priceRangeBase) {
-        if (Number.isFinite(Number(r.priceNormalizedBase))) {
-          if (!numberInsideRange(Number(r.priceNormalizedBase), priceRangeBase)) return false
+        const normalizedMin = Number.isFinite(Number(r.priceBaseMin)) ? Number(r.priceBaseMin) : Number(r.priceNormalizedBase)
+        const normalizedMax = Number.isFinite(Number(r.priceBaseMax)) ? Number(r.priceBaseMax) : Number(r.priceNormalizedBase)
+        if (Number.isFinite(normalizedMin) || Number.isFinite(normalizedMax)) {
+          const synthetic = `${Number.isFinite(normalizedMin) ? normalizedMin : ''}-${Number.isFinite(normalizedMax) ? normalizedMax : ''}`
+          if (!rangesOverlap(priceRangeBase, synthetic)) return false
         } else if (!rangesOverlap(priceRange, r.price_range || '')) return false
       }
       if (wantedIncoterms.length > 0) {
diff --git a/server/server.js b/server/server.js
index 5025c1d..7b16632 100644
--- a/server/server.js
+++ b/server/server.js
@@ -60,13 +60,14 @@ import { ensureDatabaseConnection, closeDatabaseConnection } from './utils/db.js
 import { revokeExpiredVerifications } from './services/verificationService.js'
 import { enforcePartnerFreeTierLimits } from './services/partnerNetworkService.js'
 import { runLeadReminderSweep } from './services/leadReminderService.js'
-import { refreshRates } from './services/currencyService.js'
+import { getFxHealth, refreshRates } from './services/currencyService.js'
 import { startEventQualityReporter } from './services/eventIngestionService.js'
 
 const app = express()
 const PORT = process.env.PORT || 4000
 
 const FX_REFRESH_INTERVAL_MS = 60 * 60 * 1000
+refreshRates().catch(() => null)
 setInterval(() => {
   refreshRates().catch(() => null)
 }, FX_REFRESH_INTERVAL_MS).unref()
@@ -92,7 +93,11 @@ if (serveDist && fs.existsSync(distRoot)) {
 app.use('/api', requestLogger({ timeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 45000) }))
 
 app.get('/api/health', (req, res) => {
-  res.json({ ok: true, service: 'textile-trust-verification-mvp' })
+  res.json({
+    ok: true,
+    service: 'textile-trust-verification-mvp',
+    fx: getFxHealth(),
+  })
 })
 app.use('/api/auth', authRoutes)
 app.use('/api/users', userRoutes)
diff --git a/server/services/__tests__/currencyService.test.js b/server/services/__tests__/currencyService.test.js
index 5543490..e96eb9f 100644
--- a/server/services/__tests__/currencyService.test.js
+++ b/server/services/__tests__/currencyService.test.js
@@ -5,7 +5,7 @@ import { getRate, normalizeMoney } from '../currencyService.js'
 
 function withMockedPrisma({ currencyConfig, fxRate, upsertImpl } = {}) {
   prisma.currencyConfig = {
-    findFirst: async () => currencyConfig || { defaultBaseCurrency: 'USD', staleThresholdHours: 24 },
+    findFirst: async () => currencyConfig || { baseCurrency: 'USD', staleToleranceMinutes: 1440 },
   }
   prisma.fxRate = {
     findUnique: async () => fxRate || null,
@@ -13,7 +13,7 @@ function withMockedPrisma({ currencyConfig, fxRate, upsertImpl } = {}) {
   }
 }
 
-test('normalizeMoney converts from quote currency to base currency using latest FX', async () => {
+test('normalizeMoney converts from quote currency to base currency using live FX', async () => {
   withMockedPrisma({ fxRate: null })
   const originalFetch = global.fetch
   global.fetch = async () => ({
@@ -28,14 +28,15 @@ test('normalizeMoney converts from quote currency to base currency using latest
   assert.equal(converted.currency_base, 'USD')
   assert.equal(converted.currency_from, 'EUR')
   assert.equal(converted.fx_stale, false)
+  assert.equal(converted.warning, null)
 
   global.fetch = originalFetch
 })
 
-test('getRate falls back to stale cached rate when provider fails', async () => {
+test('getRate marks cached entry stale when expired', async () => {
   withMockedPrisma({
     fxRate: {
-      rate: 0.9,
+      rate: 0.92,
       source: 'cached',
       fetchedAt: new Date('2026-03-01T00:00:00.000Z'),
       expiresAt: new Date('2026-03-02T00:00:00.000Z'),
@@ -44,13 +45,30 @@ test('getRate falls back to stale cached rate when provider fails', async () =>
 
   const originalFetch = global.fetch
   global.fetch = async () => {
-    throw new Error('network_down')
+    throw new Error('provider_down')
   }
 
   const rate = await getRate('USD', 'GBP')
-  assert.equal(rate.rate, 0.9)
+  assert.equal(rate.rate, 0.92)
   assert.equal(rate.fx_stale, true)
   assert.equal(rate.stale, true)
+  assert.equal(rate.warning?.code, 'fx_provider_unavailable_stale_rate')
+
+  global.fetch = originalFetch
+})
+
+test('normalizeMoney returns unavailable warning when no cache and provider fails', async () => {
+  withMockedPrisma({ fxRate: null })
+
+  const originalFetch = global.fetch
+  global.fetch = async () => {
+    throw new Error('network_down')
+  }
+
+  const converted = await normalizeMoney(50, 'NOK', 'USD')
+  assert.equal(converted.amount, null)
+  assert.equal(converted.fx_stale, true)
+  assert.equal(converted.warning?.code, 'fx_rate_unavailable')
 
   global.fetch = originalFetch
 })
diff --git a/server/services/analyticsService.js b/server/services/analyticsService.js
index e3c023e..bd3f1ca 100644
--- a/server/services/analyticsService.js
+++ b/server/services/analyticsService.js
@@ -126,6 +126,15 @@ function bucketNormalizedPrice(value) {
   return '50+'
 }
 
+function normalizedPriceForBucket(row = {}) {
+  const min = Number(row?.priceBaseMin)
+  const max = Number(row?.priceBaseMax)
+  if (Number.isFinite(min)) return min
+  if (Number.isFinite(max)) return max
+  const legacy = Number(row?.priceNormalizedBase)
+  return Number.isFinite(legacy) ? legacy : null
+}
+
 function parseMatchId(matchId = '') {
   const parts = String(matchId || '').split(':')
   if (parts.length !== 2) return null
@@ -623,7 +632,7 @@ export async function getPlatformAnalytics(user) {
     byCountry[country][category] = (byCountry[country][category] || 0) + 1
     globalCategories[category] = (globalCategories[category] || 0) + 1
 
-    const bucket = bucketNormalizedPrice(req.priceNormalizedBase)
+    const bucket = bucketNormalizedPrice(normalizedPriceForBucket(req))
     priceBuckets[bucket] = (priceBuckets[bucket] || 0) + 1
   }
 
@@ -793,7 +802,7 @@ export async function getPremiumInsights(user) {
     }, {})
 
     const priceBuckets = myRequests.reduce((acc, r) => {
-      const bucket = bucketNormalizedPrice(r.priceNormalizedBase)
+      const bucket = bucketNormalizedPrice(normalizedPriceForBucket(r))
       acc[bucket] = (acc[bucket] || 0) + 1
       return acc
     }, {})
diff --git a/server/services/currencyService.js b/server/services/currencyService.js
index 2c88d35..a26a85a 100644
--- a/server/services/currencyService.js
+++ b/server/services/currencyService.js
@@ -2,12 +2,21 @@ import prisma from '../utils/prisma.js'
 import { readJson } from '../utils/jsonStore.js'
 
 const DEFAULT_BASE = 'USD'
-const DEFAULT_STALE_HOURS = 24
+const DEFAULT_STALE_TOLERANCE_MINUTES = 24 * 60
 const FX_SOURCE = 'frankfurter'
 const HTTP_TIMEOUT_MS = 5000
 
 const memoryRates = new Map()
 
+let fxHealth = {
+  last_refresh_started_at: '',
+  last_refresh_completed_at: '',
+  last_refresh_ok_at: '',
+  last_refresh_error_at: '',
+  last_refresh_error: '',
+  last_refresh_result: null,
+}
+
 function nowIso() {
   return new Date().toISOString()
 }
@@ -23,12 +32,13 @@ function parseNumberish(value) {
   return Number.isFinite(n) ? n : null
 }
 
-function parseFirstAmount(value) {
-  const raw = String(value || '')
-  const match = raw.match(/\d+(\.\d+)?/)
-  if (!match) return null
-  const n = Number(match[0])
-  return Number.isFinite(n) ? n : null
+function parseRangeAmounts(value) {
+  const raw = String(value || '').trim()
+  if (!raw) return { min: null, max: null }
+  const [a, b] = raw.split('-')
+  const min = parseNumberish(a)
+  const max = parseNumberish(b)
+  return { min, max }
 }
 
 function isFuture(iso) {
@@ -40,13 +50,16 @@ async function getCurrencyConfig() {
   try {
     const row = await prisma.currencyConfig.findFirst()
     return {
-      defaultBaseCurrency: toCurrency(row?.defaultBaseCurrency, DEFAULT_BASE),
-      staleThresholdHours: Math.max(1, Number(row?.staleThresholdHours || DEFAULT_STALE_HOURS)),
+      baseCurrency: toCurrency(row?.baseCurrency || row?.defaultBaseCurrency, DEFAULT_BASE),
+      staleToleranceMinutes: Math.max(
+        1,
+        Number(row?.staleToleranceMinutes || row?.staleThresholdHours * 60 || DEFAULT_STALE_TOLERANCE_MINUTES),
+      ),
     }
   } catch {
     return {
-      defaultBaseCurrency: DEFAULT_BASE,
-      staleThresholdHours: DEFAULT_STALE_HOURS,
+      baseCurrency: DEFAULT_BASE,
+      staleToleranceMinutes: DEFAULT_STALE_TOLERANCE_MINUTES,
     }
   }
 }
@@ -82,9 +95,9 @@ async function readCachedRate(base, quote) {
   }
 }
 
-async function persistRate(base, quote, rate, source, staleHours) {
+async function persistRate(base, quote, rate, source, staleToleranceMinutes) {
   const fetchedAt = new Date()
-  const expiresAt = new Date(fetchedAt.getTime() + staleHours * 60 * 60 * 1000)
+  const expiresAt = new Date(fetchedAt.getTime() + staleToleranceMinutes * 60 * 1000)
   const payload = {
     base,
     quote,
@@ -118,10 +131,11 @@ async function persistRate(base, quote, rate, source, staleHours) {
     fetchedAt: fetchedAt.toISOString(),
     expiresAt: expiresAt.toISOString(),
     stale: false,
+    warning: null,
   }
 }
 
-async function fetchLiveRate(base, quote, staleHours) {
+async function fetchLiveRate(base, quote, staleToleranceMinutes) {
   const ctrl = new AbortController()
   const timeout = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS)
   try {
@@ -131,7 +145,7 @@ async function fetchLiveRate(base, quote, staleHours) {
     const json = await response.json()
     const rate = Number(json?.rates?.[quote])
     if (!Number.isFinite(rate) || rate <= 0) throw new Error('fx_rate_invalid')
-    return persistRate(base, quote, rate, FX_SOURCE, staleHours)
+    return persistRate(base, quote, rate, FX_SOURCE, staleToleranceMinutes)
   } finally {
     clearTimeout(timeout)
   }
@@ -150,23 +164,34 @@ export async function getRate(base, quote, options = {}) {
       expiresAt: null,
       stale: false,
       fx_stale: false,
+      warning: null,
     }
   }
 
   const cfg = await getCurrencyConfig()
-  const staleHours = Math.max(1, Number(options.staleThresholdHours || cfg.staleThresholdHours || DEFAULT_STALE_HOURS))
+  const staleToleranceMinutes = Math.max(
+    1,
+    Number(options.staleToleranceMinutes || cfg.staleToleranceMinutes || DEFAULT_STALE_TOLERANCE_MINUTES),
+  )
 
   const cached = await readCachedRate(normalizedBase, normalizedQuote)
-  if (cached && !cached.stale) return { ...cached, fx_stale: false }
+  if (cached && !cached.stale) return { ...cached, fx_stale: false, warning: null }
 
   try {
-    return await fetchLiveRate(normalizedBase, normalizedQuote, staleHours)
+    return await fetchLiveRate(normalizedBase, normalizedQuote, staleToleranceMinutes)
   } catch {
     if (cached) {
       return {
         ...cached,
         stale: true,
         fx_stale: true,
+        warning: {
+          code: 'fx_provider_unavailable_stale_rate',
+          message: 'Live FX provider unavailable; using last known valid rate.',
+          source: cached.source || 'cached',
+          fetchedAt: cached.fetchedAt || null,
+          expiresAt: cached.expiresAt || null,
+        },
       }
     }
     return null
@@ -176,7 +201,14 @@ export async function getRate(base, quote, options = {}) {
 export async function normalizeMoney(amount, from, toBase) {
   const value = parseNumberish(amount)
   if (!Number.isFinite(value)) {
-    return { amount: null, rate: null, currency_from: toCurrency(from), currency_base: toCurrency(toBase), fx_stale: false }
+    return {
+      amount: null,
+      rate: null,
+      currency_from: toCurrency(from),
+      currency_base: toCurrency(toBase),
+      fx_stale: false,
+      warning: null,
+    }
   }
 
   const fromCurrency = toCurrency(from)
@@ -188,6 +220,7 @@ export async function normalizeMoney(amount, from, toBase) {
       currency_from: fromCurrency,
       currency_base: baseCurrency,
       fx_stale: false,
+      warning: null,
     }
   }
 
@@ -199,6 +232,10 @@ export async function normalizeMoney(amount, from, toBase) {
       currency_from: fromCurrency,
       currency_base: baseCurrency,
       fx_stale: true,
+      warning: {
+        code: 'fx_rate_unavailable',
+        message: 'FX rate unavailable and no valid cached fallback exists.',
+      },
     }
   }
 
@@ -209,59 +246,116 @@ export async function normalizeMoney(amount, from, toBase) {
     currency_from: fromCurrency,
     currency_base: baseCurrency,
     fx_stale: Boolean(rateEntry.fx_stale || rateEntry.stale),
+    warning: rateEntry.warning || null,
+  }
+}
+
+export async function normalizePriceRange({ min, max, currency, baseCurrency } = {}) {
+  const minConv = await normalizeMoney(min, currency, baseCurrency)
+  const maxConv = await normalizeMoney(max, currency, baseCurrency)
+
+  return {
+    priceOriginalMin: Number.isFinite(min) ? Number(min) : null,
+    priceOriginalMax: Number.isFinite(max) ? Number(max) : null,
+    priceBaseMin: minConv.amount,
+    priceBaseMax: maxConv.amount,
+    fx_stale: Boolean(minConv.fx_stale || maxConv.fx_stale),
+    warnings: [minConv.warning, maxConv.warning].filter(Boolean),
   }
 }
 
 export async function getBaseCurrency() {
   const cfg = await getCurrencyConfig()
-  return toCurrency(cfg.defaultBaseCurrency, DEFAULT_BASE)
+  return toCurrency(cfg.baseCurrency, DEFAULT_BASE)
 }
 
 export function extractOriginalPrice(payload = {}) {
-  const currency = toCurrency(payload.currencyOriginal || payload.currency || payload.currency_original || DEFAULT_BASE)
-  const direct = parseNumberish(payload.priceOriginal ?? payload.price)
-  if (Number.isFinite(direct)) {
-    return { priceOriginal: direct, currencyOriginal: currency }
+  const currency = toCurrency(payload.currency || payload.currencyOriginal || payload.currency_original || DEFAULT_BASE)
+
+  const directMin = parseNumberish(payload.priceOriginalMin ?? payload.price_min ?? payload.priceMin)
+  const directMax = parseNumberish(payload.priceOriginalMax ?? payload.price_max ?? payload.priceMax)
+  if (Number.isFinite(directMin) || Number.isFinite(directMax)) {
+    const min = Number.isFinite(directMin) ? directMin : directMax
+    const max = Number.isFinite(directMax) ? directMax : directMin
+    return {
+      priceOriginalMin: Number.isFinite(min) ? min : null,
+      priceOriginalMax: Number.isFinite(max) ? max : null,
+      currency,
+    }
   }
 
-  const parsed = parseFirstAmount(payload.price_range || payload.priceRange || payload.target_price || payload.target_fob_price)
+  const directSingle = parseNumberish(payload.priceOriginal ?? payload.price)
+  if (Number.isFinite(directSingle)) {
+    return {
+      priceOriginalMin: directSingle,
+      priceOriginalMax: directSingle,
+      currency,
+    }
+  }
+
+  const parsed = parseRangeAmounts(payload.price_range || payload.priceRange || payload.target_price || payload.target_fob_price)
   return {
-    priceOriginal: Number.isFinite(parsed) ? parsed : null,
-    currencyOriginal: currency,
+    priceOriginalMin: Number.isFinite(parsed.min) ? parsed.min : null,
+    priceOriginalMax: Number.isFinite(parsed.max) ? parsed.max : (Number.isFinite(parsed.min) ? parsed.min : null),
+    currency,
   }
 }
 
+export function getFxHealth() {
+  return { ...fxHealth }
+}
+
 export async function refreshRates() {
-  const base = await getBaseCurrency()
-  const [products, requirements] = await Promise.all([
-    readJson('company_products.json'),
-    readJson('requirements.json'),
-  ])
-
-  const currencies = new Set([base])
-  ;[...(Array.isArray(products) ? products : []), ...(Array.isArray(requirements) ? requirements : [])].forEach((row) => {
-    const code = toCurrency(row?.currencyOriginal || row?.currency || row?.currency_original || '')
-    if (code) currencies.add(code)
-  })
+  fxHealth = { ...fxHealth, last_refresh_started_at: nowIso() }
+  try {
+    const base = await getBaseCurrency()
+    const [products, requirements] = await Promise.all([
+      readJson('company_products.json'),
+      readJson('requirements.json'),
+    ])
+
+    const currencies = new Set([base])
+    ;[...(Array.isArray(products) ? products : []), ...(Array.isArray(requirements) ? requirements : [])].forEach((row) => {
+      const code = toCurrency(row?.currency || row?.currencyOriginal || row?.currency_original || '')
+      if (code) currencies.add(code)
+    })
 
-  const targets = [...currencies].filter((code) => code && code !== base)
-  const refreshed = []
-  let fx_stale = false
+    const targets = [...currencies].filter((code) => code && code !== base)
+    const refreshed = []
+    let fx_stale = false
 
-  for (const quote of targets) {
-    const entry = await getRate(base, quote)
-    if (!entry) {
-      fx_stale = true
-      continue
+    for (const quote of targets) {
+      const entry = await getRate(base, quote)
+      if (!entry) {
+        fx_stale = true
+        continue
+      }
+      if (entry.fx_stale || entry.stale) fx_stale = true
+      refreshed.push({ quote, rate: entry.rate, stale: Boolean(entry.fx_stale || entry.stale) })
     }
-    if (entry.fx_stale || entry.stale) fx_stale = true
-    refreshed.push({ quote, rate: entry.rate, stale: Boolean(entry.fx_stale || entry.stale) })
-  }
 
-  return {
-    base,
-    refreshed_count: refreshed.length,
-    refreshed,
-    fx_stale,
+    const result = {
+      base,
+      refreshed_count: refreshed.length,
+      refreshed,
+      fx_stale,
+    }
+    fxHealth = {
+      ...fxHealth,
+      last_refresh_completed_at: nowIso(),
+      last_refresh_ok_at: nowIso(),
+      last_refresh_result: result,
+      last_refresh_error: fx_stale ? 'partial_stale_rates' : '',
+      ...(fx_stale ? { last_refresh_error_at: nowIso() } : {}),
+    }
+    return result
+  } catch (error) {
+    fxHealth = {
+      ...fxHealth,
+      last_refresh_completed_at: nowIso(),
+      last_refresh_error_at: nowIso(),
+      last_refresh_error: error?.message || 'fx_refresh_failed',
+    }
+    throw error
   }
 }
diff --git a/server/services/openSearchService.js b/server/services/openSearchService.js
index a672d95..ab4db70 100644
--- a/server/services/openSearchService.js
+++ b/server/services/openSearchService.js
@@ -150,8 +150,6 @@ function productMappings() {
       sample_available: { type: 'boolean' },
       sample_lead_time_days: { type: 'double' },
       moq_value: { type: 'double' },
-      price_min: { type: 'double' },
-      price_max: { type: 'double' },
       price_base_min: { type: 'double' },
       price_base_max: { type: 'double' },
       base_currency: { type: 'keyword' },
@@ -194,8 +192,6 @@ function requirementMappings() {
       sample_lead_time_days: { type: 'double' },
       capacity_min: { type: 'double' },
       moq_value: { type: 'double' },
-      price_min: { type: 'double' },
-      price_max: { type: 'double' },
       price_base_min: { type: 'double' },
       price_base_max: { type: 'double' },
       base_currency: { type: 'keyword' },
@@ -321,15 +317,15 @@ async function buildResponseTimeByOwner() {
 }
 
 async function buildProductDoc(product, author = {}, responseMap = null) {
-  const priceRange = parseRangeValue(product.price_range || '')
   const baseCurrency = await getBaseCurrency()
-  const originalCurrency = normalizeKeyword(product.currencyOriginal || product.currency || baseCurrency).toUpperCase()
-  const priceBaseMin = priceRange.min !== null
-    ? (await normalizeMoney(priceRange.min, originalCurrency, baseCurrency)).amount
-    : (Number.isFinite(Number(product.priceNormalizedBase)) ? Number(product.priceNormalizedBase) : null)
-  const priceBaseMax = priceRange.max !== null
-    ? (await normalizeMoney(priceRange.max, originalCurrency, baseCurrency)).amount
-    : (Number.isFinite(Number(product.priceNormalizedBase)) ? Number(product.priceNormalizedBase) : null)
+  const priceRange = parseRangeValue(product.price_range || '')
+  const originalCurrency = normalizeKeyword(product.currency || product.currencyOriginal || baseCurrency).toUpperCase()
+  const priceBaseMin = Number.isFinite(Number(product.priceBaseMin))
+    ? Number(product.priceBaseMin)
+    : (priceRange.min !== null ? (await normalizeMoney(priceRange.min, originalCurrency, baseCurrency)).amount : Number(product.priceNormalizedBase) || null)
+  const priceBaseMax = Number.isFinite(Number(product.priceBaseMax))
+    ? Number(product.priceBaseMax)
+    : (priceRange.max !== null ? (await normalizeMoney(priceRange.max, originalCurrency, baseCurrency)).amount : Number(product.priceNormalizedBase) || null)
   const moqValue = parseNumberLike(product.moq)
   const leadTime = parseNumberLike(product.lead_time_days || author.lead_time_days)
   const fabricGsm = parseNumberLike(product.fabric_gsm)
@@ -355,8 +351,6 @@ async function buildProductDoc(product, author = {}, responseMap = null) {
     sample_available: sampleAvailable,
     sample_lead_time_days: sampleLead,
     moq_value: moqValue,
-    price_min: priceRange.min,
-    price_max: priceRange.max,
     price_base_min: priceBaseMin,
     price_base_max: priceBaseMax,
     base_currency: baseCurrency,
@@ -391,15 +385,15 @@ function shouldIndexProduct(product) {
 }
 
 async function buildRequirementDoc(req, author = {}, responseMap = null) {
-  const priceRange = parseRangeValue(req.price_range || req.target_price || '')
   const baseCurrency = await getBaseCurrency()
-  const originalCurrency = normalizeKeyword(req.currencyOriginal || req.currency || baseCurrency).toUpperCase()
-  const priceBaseMin = priceRange.min !== null
-    ? (await normalizeMoney(priceRange.min, originalCurrency, baseCurrency)).amount
-    : (Number.isFinite(Number(req.priceNormalizedBase)) ? Number(req.priceNormalizedBase) : null)
-  const priceBaseMax = priceRange.max !== null
-    ? (await normalizeMoney(priceRange.max, originalCurrency, baseCurrency)).amount
-    : (Number.isFinite(Number(req.priceNormalizedBase)) ? Number(req.priceNormalizedBase) : null)
+  const priceRange = parseRangeValue(req.price_range || req.target_price || '')
+  const originalCurrency = normalizeKeyword(req.currency || req.currencyOriginal || baseCurrency).toUpperCase()
+  const priceBaseMin = Number.isFinite(Number(req.priceBaseMin))
+    ? Number(req.priceBaseMin)
+    : (priceRange.min !== null ? (await normalizeMoney(priceRange.min, originalCurrency, baseCurrency)).amount : Number(req.priceNormalizedBase) || null)
+  const priceBaseMax = Number.isFinite(Number(req.priceBaseMax))
+    ? Number(req.priceBaseMax)
+    : (priceRange.max !== null ? (await normalizeMoney(priceRange.max, originalCurrency, baseCurrency)).amount : Number(req.priceNormalizedBase) || null)
   const moqValue = parseNumberLike(req.moq || req.quantity)
   const leadTime = parseNumberLike(req.timeline_days || req.delivery_timeline || '')
   const fabricGsm = parseNumberLike(req.fabric_gsm)
@@ -427,8 +421,6 @@ async function buildRequirementDoc(req, author = {}, responseMap = null) {
     sample_lead_time_days: sampleLead,
     capacity_min: capacityMin,
     moq_value: moqValue,
-    price_min: priceRange.min,
-    price_max: priceRange.max,
     price_base_min: priceBaseMin,
     price_base_max: priceBaseMax,
     base_currency: baseCurrency,
diff --git a/server/services/productService.js b/server/services/productService.js
index e524cb1..75ff1c7 100644
--- a/server/services/productService.js
+++ b/server/services/productService.js
@@ -8,7 +8,7 @@ import { isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
 import { getAdminConfig } from './adminConfigService.js'
 import { getPlanForUser } from './entitlementService.js'
 import { indexProduct, deleteProductIndex } from './openSearchService.js'
-import { extractOriginalPrice, getBaseCurrency, normalizeMoney } from './currencyService.js'
+import { extractOriginalPrice, getBaseCurrency, normalizePriceRange } from './currencyService.js'
 
 const FILE = 'company_products.json'
 const PROHIBITED_MEDIA_KEYWORDS = ['porn', 'explicit', 'nudity', 'violence', 'weapon', 'drugs', 'hate']
@@ -431,10 +431,18 @@ export async function createProduct(user, payload) {
 
   const baseCurrency = await getBaseCurrency()
   const originalPrice = extractOriginalPrice(payload)
-  const normalizedPrice = await normalizeMoney(originalPrice.priceOriginal, originalPrice.currencyOriginal, baseCurrency)
-  row.priceOriginal = originalPrice.priceOriginal
-  row.currencyOriginal = originalPrice.currencyOriginal
-  row.priceNormalizedBase = normalizedPrice.amount
+  const normalizedPrice = await normalizePriceRange({
+    min: originalPrice.priceOriginalMin,
+    max: originalPrice.priceOriginalMax,
+    currency: originalPrice.currency,
+    baseCurrency,
+  })
+  row.currency = originalPrice.currency
+  row.priceOriginalMin = normalizedPrice.priceOriginalMin
+  row.priceOriginalMax = normalizedPrice.priceOriginalMax
+  row.priceBaseMin = normalizedPrice.priceBaseMin
+  row.priceBaseMax = normalizedPrice.priceBaseMax
+  row.priceNormalizedBase = normalizedPrice.priceBaseMin
 
   // Trust & safety (project.md): strip outside-contact sharing / obscene content from descriptions.
   try {
@@ -611,15 +619,24 @@ export async function updateProductById(actor, productId, patch = {}) {
 
   const baseCurrency = await getBaseCurrency()
   const originalPrice = extractOriginalPrice({
+    priceOriginalMin: patch.priceOriginalMin !== undefined ? patch.priceOriginalMin : existing.priceOriginalMin,
+    priceOriginalMax: patch.priceOriginalMax !== undefined ? patch.priceOriginalMax : existing.priceOriginalMax,
     priceOriginal: patch.priceOriginal !== undefined ? patch.priceOriginal : existing.priceOriginal,
-    currencyOriginal: patch.currencyOriginal !== undefined ? patch.currencyOriginal : existing.currencyOriginal,
-    currency: patch.currency !== undefined ? patch.currency : existing.currencyOriginal,
+    currency: patch.currency !== undefined ? patch.currency : (existing.currency || existing.currencyOriginal),
     price_range: next.price_range,
   })
-  const normalizedPrice = await normalizeMoney(originalPrice.priceOriginal, originalPrice.currencyOriginal, baseCurrency)
-  next.priceOriginal = originalPrice.priceOriginal
-  next.currencyOriginal = originalPrice.currencyOriginal
-  next.priceNormalizedBase = normalizedPrice.amount
+  const normalizedPrice = await normalizePriceRange({
+    min: originalPrice.priceOriginalMin,
+    max: originalPrice.priceOriginalMax,
+    currency: originalPrice.currency,
+    baseCurrency,
+  })
+  next.currency = originalPrice.currency
+  next.priceOriginalMin = normalizedPrice.priceOriginalMin
+  next.priceOriginalMax = normalizedPrice.priceOriginalMax
+  next.priceBaseMin = normalizedPrice.priceBaseMin
+  next.priceBaseMax = normalizedPrice.priceBaseMax
+  next.priceNormalizedBase = normalizedPrice.priceBaseMin
 
   all[idx] = next
   await writeJson(FILE, all)
diff --git a/server/services/requirementService.js b/server/services/requirementService.js
index 1100931..d0196b8 100644
--- a/server/services/requirementService.js
+++ b/server/services/requirementService.js
@@ -7,7 +7,7 @@ import { recordMilestone } from './ratingsService.js'
 import { moderateTextOrRedact } from './policyService.js'
 import { getPlanForUser } from './entitlementService.js'
 import { indexRequirement, deleteRequirementIndex } from './openSearchService.js'
-import { extractOriginalPrice, getBaseCurrency, normalizeMoney } from './currencyService.js'
+import { extractOriginalPrice, getBaseCurrency, normalizePriceRange } from './currencyService.js'
 
 const FILE = 'requirements.json'
 
@@ -241,10 +241,18 @@ export async function createRequirement(buyerId, payload) {
   const requirement = normalizeRequirement(buyerId, payload)
   const baseCurrency = await getBaseCurrency()
   const originalPrice = extractOriginalPrice(payload)
-  const normalizedPrice = await normalizeMoney(originalPrice.priceOriginal, originalPrice.currencyOriginal, baseCurrency)
-  requirement.priceOriginal = originalPrice.priceOriginal
-  requirement.currencyOriginal = originalPrice.currencyOriginal
-  requirement.priceNormalizedBase = normalizedPrice.amount
+  const normalizedPrice = await normalizePriceRange({
+    min: originalPrice.priceOriginalMin,
+    max: originalPrice.priceOriginalMax,
+    currency: originalPrice.currency,
+    baseCurrency,
+  })
+  requirement.currency = originalPrice.currency
+  requirement.priceOriginalMin = normalizedPrice.priceOriginalMin
+  requirement.priceOriginalMax = normalizedPrice.priceOriginalMax
+  requirement.priceBaseMin = normalizedPrice.priceBaseMin
+  requirement.priceBaseMax = normalizedPrice.priceBaseMax
+  requirement.priceNormalizedBase = normalizedPrice.priceBaseMin
   const plan = await getPlanForUser({ id: buyerId })
   if (plan === 'premium') {
     requirement.priority_tier = 'priority'
@@ -408,15 +416,24 @@ export async function updateRequirement(requirementId, patch, actor) {
 
   const baseCurrency = await getBaseCurrency()
   const originalPrice = extractOriginalPrice({
+    priceOriginalMin: patch.priceOriginalMin !== undefined ? patch.priceOriginalMin : previous.priceOriginalMin,
+    priceOriginalMax: patch.priceOriginalMax !== undefined ? patch.priceOriginalMax : previous.priceOriginalMax,
     priceOriginal: patch.priceOriginal !== undefined ? patch.priceOriginal : previous.priceOriginal,
-    currencyOriginal: patch.currencyOriginal !== undefined ? patch.currencyOriginal : previous.currencyOriginal,
-    currency: patch.currency !== undefined ? patch.currency : previous.currencyOriginal,
+    currency: patch.currency !== undefined ? patch.currency : (previous.currency || previous.currencyOriginal),
     price_range: next.price_range,
   })
-  const normalizedPrice = await normalizeMoney(originalPrice.priceOriginal, originalPrice.currencyOriginal, baseCurrency)
-  next.priceOriginal = originalPrice.priceOriginal
-  next.currencyOriginal = originalPrice.currencyOriginal
-  next.priceNormalizedBase = normalizedPrice.amount
+  const normalizedPrice = await normalizePriceRange({
+    min: originalPrice.priceOriginalMin,
+    max: originalPrice.priceOriginalMax,
+    currency: originalPrice.currency,
+    baseCurrency,
+  })
+  next.currency = originalPrice.currency
+  next.priceOriginalMin = normalizedPrice.priceOriginalMin
+  next.priceOriginalMax = normalizedPrice.priceOriginalMax
+  next.priceBaseMin = normalizedPrice.priceBaseMin
+  next.priceBaseMax = normalizedPrice.priceBaseMax
+  next.priceNormalizedBase = normalizedPrice.priceBaseMin
 
   assertRequiredFields({
     ...next,
```

## Why This Change
Implement normalized FX pricing pipeline and stale-rate telemetry

## Was It Useful
Yes — part of iterative feature development.

## Impact Analysis
- **Scope:**  10 files changed, 286 insertions(+), 122 deletions(-)
- **Risk:** Moderate

## Relationships
Commit 201 in the 0181-0220 sequence.

## Confidence Notes
Auto-generated from git history.
