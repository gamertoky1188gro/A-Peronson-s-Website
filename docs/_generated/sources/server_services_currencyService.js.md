    1 | import prisma from '../utils/prisma.js'
    2 | import { readJson } from '../utils/jsonStore.js'
    3 | 
    4 | const DEFAULT_BASE = 'USD'
    5 | const DEFAULT_STALE_TOLERANCE_MINUTES = 24 * 60
    6 | const FX_SOURCE = 'frankfurter'
    7 | const HTTP_TIMEOUT_MS = 5000
    8 | 
    9 | const memoryRates = new Map()
   10 | 
   11 | let fxHealth = {
   12 |   last_refresh_started_at: '',
   13 |   last_refresh_completed_at: '',
   14 |   last_refresh_ok_at: '',
   15 |   last_refresh_error_at: '',
   16 |   last_refresh_error: '',
   17 |   last_refresh_result: null,
   18 | }
   19 | 
   20 | function nowIso() {
   21 |   return new Date().toISOString()
   22 | }
   23 | 
   24 | function toCurrency(code, fallback = DEFAULT_BASE) {
   25 |   const raw = String(code || fallback).trim().toUpperCase()
   26 |   return raw || fallback
   27 | }
   28 | 
   29 | function parseNumberish(value) {
   30 |   if (value === undefined || value === null) return null
   31 |   const n = Number(String(value).replace(/[^\d.-]/g, ''))
   32 |   return Number.isFinite(n) ? n : null
   33 | }
   34 | 
   35 | function parseRangeAmounts(value) {
   36 |   const raw = String(value || '').trim()
   37 |   if (!raw) return { min: null, max: null }
   38 |   const [a, b] = raw.split('-')
   39 |   const min = parseNumberish(a)
   40 |   const max = parseNumberish(b)
   41 |   return { min, max }
   42 | }
   43 | 
   44 | function isFuture(iso) {
   45 |   const ts = new Date(iso || '').getTime()
   46 |   return Number.isFinite(ts) && ts > Date.now()
   47 | }
   48 | 
   49 | async function getCurrencyConfig() {
   50 |   try {
   51 |     const row = await prisma.currencyConfig.findFirst()
   52 |     return {
   53 |       baseCurrency: toCurrency(row?.baseCurrency || row?.defaultBaseCurrency, DEFAULT_BASE),
   54 |       staleToleranceMinutes: Math.max(
   55 |         1,
   56 |         Number(row?.staleToleranceMinutes || row?.staleThresholdHours * 60 || DEFAULT_STALE_TOLERANCE_MINUTES),
   57 |       ),
   58 |     }
   59 |   } catch {
   60 |     return {
   61 |       baseCurrency: DEFAULT_BASE,
   62 |       staleToleranceMinutes: DEFAULT_STALE_TOLERANCE_MINUTES,
   63 |     }
   64 |   }
   65 | }
   66 | 
   67 | function memoryKey(base, quote) {
   68 |   return `${base}:${quote}`
   69 | }
   70 | 
   71 | async function readCachedRate(base, quote) {
   72 |   const key = memoryKey(base, quote)
   73 |   if (memoryRates.has(key)) return memoryRates.get(key)
   74 | 
   75 |   try {
   76 |     const row = await prisma.fxRate.findUnique({
   77 |       where: {
   78 |         fx_base_quote: { base, quote },
   79 |       },
   80 |     })
   81 |     if (!row) return null
   82 |     const cached = {
   83 |       base,
   84 |       quote,
   85 |       rate: Number(row.rate),
   86 |       source: String(row.source || 'cached'),
   87 |       fetchedAt: row.fetchedAt?.toISOString?.() || row.fetchedAt,
   88 |       expiresAt: row.expiresAt?.toISOString?.() || row.expiresAt,
   89 |       stale: !isFuture(row.expiresAt),
   90 |     }
   91 |     memoryRates.set(key, cached)
   92 |     return cached
   93 |   } catch {
   94 |     return null
   95 |   }
   96 | }
   97 | 
   98 | async function persistRate(base, quote, rate, source, staleToleranceMinutes) {
   99 |   const fetchedAt = new Date()
  100 |   const expiresAt = new Date(fetchedAt.getTime() + staleToleranceMinutes * 60 * 1000)
  101 |   const payload = {
  102 |     base,
  103 |     quote,
  104 |     rate,
  105 |     source,
  106 |     fetchedAt,
  107 |     expiresAt,
  108 |   }
  109 |   memoryRates.set(memoryKey(base, quote), {
  110 |     ...payload,
  111 |     fetchedAt: fetchedAt.toISOString(),
  112 |     expiresAt: expiresAt.toISOString(),
  113 |     stale: false,
  114 |   })
  115 | 
  116 |   try {
  117 |     await prisma.fxRate.upsert({
  118 |       where: { fx_base_quote: { base, quote } },
  119 |       update: payload,
  120 |       create: payload,
  121 |     })
  122 |   } catch {
  123 |     // DB failures should not break reads; memory cache still works for the current process.
  124 |   }
  125 | 
  126 |   return {
  127 |     base,
  128 |     quote,
  129 |     rate,
  130 |     source,
  131 |     fetchedAt: fetchedAt.toISOString(),
  132 |     expiresAt: expiresAt.toISOString(),
  133 |     stale: false,
  134 |     warning: null,
  135 |   }
  136 | }
  137 | 
  138 | async function fetchLiveRate(base, quote, staleToleranceMinutes) {
  139 |   const ctrl = new AbortController()
  140 |   const timeout = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS)
  141 |   try {
  142 |     const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}&to=${encodeURIComponent(quote)}`
  143 |     const response = await fetch(url, { signal: ctrl.signal })
  144 |     if (!response.ok) throw new Error(`fx_http_${response.status}`)
  145 |     const json = await response.json()
  146 |     const rate = Number(json?.rates?.[quote])
  147 |     if (!Number.isFinite(rate) || rate <= 0) throw new Error('fx_rate_invalid')
  148 |     return persistRate(base, quote, rate, FX_SOURCE, staleToleranceMinutes)
  149 |   } finally {
  150 |     clearTimeout(timeout)
  151 |   }
  152 | }
  153 | 
  154 | export async function getRate(base, quote, options = {}) {
  155 |   const normalizedBase = toCurrency(base)
  156 |   const normalizedQuote = toCurrency(quote)
  157 |   if (normalizedBase === normalizedQuote) {
  158 |     return {
  159 |       base: normalizedBase,
  160 |       quote: normalizedQuote,
  161 |       rate: 1,
  162 |       source: 'identity',
  163 |       fetchedAt: nowIso(),
  164 |       expiresAt: null,
  165 |       stale: false,
  166 |       fx_stale: false,
  167 |       warning: null,
  168 |     }
  169 |   }
  170 | 
  171 |   const cfg = await getCurrencyConfig()
  172 |   const staleToleranceMinutes = Math.max(
  173 |     1,
  174 |     Number(options.staleToleranceMinutes || cfg.staleToleranceMinutes || DEFAULT_STALE_TOLERANCE_MINUTES),
  175 |   )
  176 | 
  177 |   const cached = await readCachedRate(normalizedBase, normalizedQuote)
  178 |   if (cached && !cached.stale) return { ...cached, fx_stale: false, warning: null }
  179 | 
  180 |   try {
  181 |     return await fetchLiveRate(normalizedBase, normalizedQuote, staleToleranceMinutes)
  182 |   } catch {
  183 |     if (cached) {
  184 |       return {
  185 |         ...cached,
  186 |         stale: true,
  187 |         fx_stale: true,
  188 |         warning: {
  189 |           code: 'fx_provider_unavailable_stale_rate',
  190 |           message: 'Live FX provider unavailable; using last known valid rate.',
  191 |           source: cached.source || 'cached',
  192 |           fetchedAt: cached.fetchedAt || null,
  193 |           expiresAt: cached.expiresAt || null,
  194 |         },
  195 |       }
  196 |     }
  197 |     return null
  198 |   }
  199 | }
  200 | 
  201 | export async function normalizeMoney(amount, from, toBase) {
  202 |   const value = parseNumberish(amount)
  203 |   if (!Number.isFinite(value)) {
  204 |     return {
  205 |       amount: null,
  206 |       rate: null,
  207 |       currency_from: toCurrency(from),
  208 |       currency_base: toCurrency(toBase),
  209 |       fx_stale: false,
  210 |       warning: null,
  211 |     }
  212 |   }
  213 | 
  214 |   const fromCurrency = toCurrency(from)
  215 |   const baseCurrency = toCurrency(toBase)
  216 |   if (fromCurrency === baseCurrency) {
  217 |     return {
  218 |       amount: Math.round(value * 10000) / 10000,
  219 |       rate: 1,
  220 |       currency_from: fromCurrency,
  221 |       currency_base: baseCurrency,
  222 |       fx_stale: false,
  223 |       warning: null,
  224 |     }
  225 |   }
  226 | 
  227 |   const rateEntry = await getRate(baseCurrency, fromCurrency)
  228 |   if (!rateEntry || !Number.isFinite(Number(rateEntry.rate)) || Number(rateEntry.rate) <= 0) {
  229 |     return {
  230 |       amount: null,
  231 |       rate: null,
  232 |       currency_from: fromCurrency,
  233 |       currency_base: baseCurrency,
  234 |       fx_stale: true,
  235 |       warning: {
  236 |         code: 'fx_rate_unavailable',
  237 |         message: 'FX rate unavailable and no valid cached fallback exists.',
  238 |       },
  239 |     }
  240 |   }
  241 | 
  242 |   const converted = value / Number(rateEntry.rate)
  243 |   return {
  244 |     amount: Math.round(converted * 10000) / 10000,
  245 |     rate: Number(rateEntry.rate),
  246 |     currency_from: fromCurrency,
  247 |     currency_base: baseCurrency,
  248 |     fx_stale: Boolean(rateEntry.fx_stale || rateEntry.stale),
  249 |     warning: rateEntry.warning || null,
  250 |   }
  251 | }
  252 | 
  253 | export async function normalizePriceRange({ min, max, currency, baseCurrency } = {}) {
  254 |   const minConv = await normalizeMoney(min, currency, baseCurrency)
  255 |   const maxConv = await normalizeMoney(max, currency, baseCurrency)
  256 | 
  257 |   return {
  258 |     priceOriginalMin: Number.isFinite(min) ? Number(min) : null,
  259 |     priceOriginalMax: Number.isFinite(max) ? Number(max) : null,
  260 |     priceBaseMin: minConv.amount,
  261 |     priceBaseMax: maxConv.amount,
  262 |     fx_stale: Boolean(minConv.fx_stale || maxConv.fx_stale),
  263 |     warnings: [minConv.warning, maxConv.warning].filter(Boolean),
  264 |   }
  265 | }
  266 | 
  267 | export async function getBaseCurrency() {
  268 |   const cfg = await getCurrencyConfig()
  269 |   return toCurrency(cfg.baseCurrency, DEFAULT_BASE)
  270 | }
  271 | 
  272 | export function extractOriginalPrice(payload = {}) {
  273 |   const currency = toCurrency(payload.currency || payload.currencyOriginal || payload.currency_original || DEFAULT_BASE)
  274 | 
  275 |   const directMin = parseNumberish(payload.priceOriginalMin ?? payload.price_min ?? payload.priceMin)
  276 |   const directMax = parseNumberish(payload.priceOriginalMax ?? payload.price_max ?? payload.priceMax)
  277 |   if (Number.isFinite(directMin) || Number.isFinite(directMax)) {
  278 |     const min = Number.isFinite(directMin) ? directMin : directMax
  279 |     const max = Number.isFinite(directMax) ? directMax : directMin
  280 |     return {
  281 |       priceOriginalMin: Number.isFinite(min) ? min : null,
  282 |       priceOriginalMax: Number.isFinite(max) ? max : null,
  283 |       currency,
  284 |     }
  285 |   }
  286 | 
  287 |   const directSingle = parseNumberish(payload.priceOriginal ?? payload.price)
  288 |   if (Number.isFinite(directSingle)) {
  289 |     return {
  290 |       priceOriginalMin: directSingle,
  291 |       priceOriginalMax: directSingle,
  292 |       currency,
  293 |     }
  294 |   }
  295 | 
  296 |   const parsed = parseRangeAmounts(payload.price_range || payload.priceRange || payload.target_price || payload.target_fob_price)
  297 |   return {
  298 |     priceOriginalMin: Number.isFinite(parsed.min) ? parsed.min : null,
  299 |     priceOriginalMax: Number.isFinite(parsed.max) ? parsed.max : (Number.isFinite(parsed.min) ? parsed.min : null),
  300 |     currency,
  301 |   }
  302 | }
  303 | 
  304 | export function getFxHealth() {
  305 |   return { ...fxHealth }
  306 | }
  307 | 
  308 | export async function refreshRates() {
  309 |   fxHealth = { ...fxHealth, last_refresh_started_at: nowIso() }
  310 |   try {
  311 |     const base = await getBaseCurrency()
  312 |     const [products, requirements] = await Promise.all([
  313 |       readJson('company_products.json'),
  314 |       readJson('requirements.json'),
  315 |     ])
  316 | 
  317 |     const currencies = new Set([base])
  318 |     ;[...(Array.isArray(products) ? products : []), ...(Array.isArray(requirements) ? requirements : [])].forEach((row) => {
  319 |       const code = toCurrency(row?.currency || row?.currencyOriginal || row?.currency_original || '')
  320 |       if (code) currencies.add(code)
  321 |     })
  322 | 
  323 |     const targets = [...currencies].filter((code) => code && code !== base)
  324 |     const refreshed = []
  325 |     let fx_stale = false
  326 | 
  327 |     for (const quote of targets) {
  328 |       const entry = await getRate(base, quote)
  329 |       if (!entry) {
  330 |         fx_stale = true
  331 |         continue
  332 |       }
  333 |       if (entry.fx_stale || entry.stale) fx_stale = true
  334 |       refreshed.push({ quote, rate: entry.rate, stale: Boolean(entry.fx_stale || entry.stale) })
  335 |     }
  336 | 
  337 |     const result = {
  338 |       base,
  339 |       refreshed_count: refreshed.length,
  340 |       refreshed,
  341 |       fx_stale,
  342 |     }
  343 |     fxHealth = {
  344 |       ...fxHealth,
  345 |       last_refresh_completed_at: nowIso(),
  346 |       last_refresh_ok_at: nowIso(),
  347 |       last_refresh_result: result,
  348 |       last_refresh_error: fx_stale ? 'partial_stale_rates' : '',
  349 |       ...(fx_stale ? { last_refresh_error_at: nowIso() } : {}),
  350 |     }
  351 |     return result
  352 |   } catch (error) {
  353 |     fxHealth = {
  354 |       ...fxHealth,
  355 |       last_refresh_completed_at: nowIso(),
  356 |       last_refresh_error_at: nowIso(),
  357 |       last_refresh_error: error?.message || 'fx_refresh_failed',
  358 |     }
  359 |     throw error
  360 |   }
  361 | }
  362 | 