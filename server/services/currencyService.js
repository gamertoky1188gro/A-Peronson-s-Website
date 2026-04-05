import prisma from '../utils/prisma.js'
import { readJson } from '../utils/jsonStore.js'

const DEFAULT_BASE = 'USD'
const DEFAULT_STALE_HOURS = 24
const FX_SOURCE = 'frankfurter'
const HTTP_TIMEOUT_MS = 5000

const memoryRates = new Map()

function nowIso() {
  return new Date().toISOString()
}

function toCurrency(code, fallback = DEFAULT_BASE) {
  const raw = String(code || fallback).trim().toUpperCase()
  return raw || fallback
}

function parseNumberish(value) {
  if (value === undefined || value === null) return null
  const n = Number(String(value).replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : null
}

function parseFirstAmount(value) {
  const raw = String(value || '')
  const match = raw.match(/\d+(\.\d+)?/)
  if (!match) return null
  const n = Number(match[0])
  return Number.isFinite(n) ? n : null
}

function isFuture(iso) {
  const ts = new Date(iso || '').getTime()
  return Number.isFinite(ts) && ts > Date.now()
}

async function getCurrencyConfig() {
  try {
    const row = await prisma.currencyConfig.findFirst()
    return {
      defaultBaseCurrency: toCurrency(row?.defaultBaseCurrency, DEFAULT_BASE),
      staleThresholdHours: Math.max(1, Number(row?.staleThresholdHours || DEFAULT_STALE_HOURS)),
    }
  } catch {
    return {
      defaultBaseCurrency: DEFAULT_BASE,
      staleThresholdHours: DEFAULT_STALE_HOURS,
    }
  }
}

function memoryKey(base, quote) {
  return `${base}:${quote}`
}

async function readCachedRate(base, quote) {
  const key = memoryKey(base, quote)
  if (memoryRates.has(key)) return memoryRates.get(key)

  try {
    const row = await prisma.fxRate.findUnique({
      where: {
        fx_base_quote: { base, quote },
      },
    })
    if (!row) return null
    const cached = {
      base,
      quote,
      rate: Number(row.rate),
      source: String(row.source || 'cached'),
      fetchedAt: row.fetchedAt?.toISOString?.() || row.fetchedAt,
      expiresAt: row.expiresAt?.toISOString?.() || row.expiresAt,
      stale: !isFuture(row.expiresAt),
    }
    memoryRates.set(key, cached)
    return cached
  } catch {
    return null
  }
}

async function persistRate(base, quote, rate, source, staleHours) {
  const fetchedAt = new Date()
  const expiresAt = new Date(fetchedAt.getTime() + staleHours * 60 * 60 * 1000)
  const payload = {
    base,
    quote,
    rate,
    source,
    fetchedAt,
    expiresAt,
  }
  memoryRates.set(memoryKey(base, quote), {
    ...payload,
    fetchedAt: fetchedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    stale: false,
  })

  try {
    await prisma.fxRate.upsert({
      where: { fx_base_quote: { base, quote } },
      update: payload,
      create: payload,
    })
  } catch {
    // DB failures should not break reads; memory cache still works for the current process.
  }

  return {
    base,
    quote,
    rate,
    source,
    fetchedAt: fetchedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    stale: false,
  }
}

async function fetchLiveRate(base, quote, staleHours) {
  const ctrl = new AbortController()
  const timeout = setTimeout(() => ctrl.abort(), HTTP_TIMEOUT_MS)
  try {
    const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}&to=${encodeURIComponent(quote)}`
    const response = await fetch(url, { signal: ctrl.signal })
    if (!response.ok) throw new Error(`fx_http_${response.status}`)
    const json = await response.json()
    const rate = Number(json?.rates?.[quote])
    if (!Number.isFinite(rate) || rate <= 0) throw new Error('fx_rate_invalid')
    return persistRate(base, quote, rate, FX_SOURCE, staleHours)
  } finally {
    clearTimeout(timeout)
  }
}

export async function getRate(base, quote, options = {}) {
  const normalizedBase = toCurrency(base)
  const normalizedQuote = toCurrency(quote)
  if (normalizedBase === normalizedQuote) {
    return {
      base: normalizedBase,
      quote: normalizedQuote,
      rate: 1,
      source: 'identity',
      fetchedAt: nowIso(),
      expiresAt: null,
      stale: false,
      fx_stale: false,
    }
  }

  const cfg = await getCurrencyConfig()
  const staleHours = Math.max(1, Number(options.staleThresholdHours || cfg.staleThresholdHours || DEFAULT_STALE_HOURS))

  const cached = await readCachedRate(normalizedBase, normalizedQuote)
  if (cached && !cached.stale) return { ...cached, fx_stale: false }

  try {
    return await fetchLiveRate(normalizedBase, normalizedQuote, staleHours)
  } catch {
    if (cached) {
      return {
        ...cached,
        stale: true,
        fx_stale: true,
      }
    }
    return null
  }
}

export async function normalizeMoney(amount, from, toBase) {
  const value = parseNumberish(amount)
  if (!Number.isFinite(value)) {
    return { amount: null, rate: null, currency_from: toCurrency(from), currency_base: toCurrency(toBase), fx_stale: false }
  }

  const fromCurrency = toCurrency(from)
  const baseCurrency = toCurrency(toBase)
  if (fromCurrency === baseCurrency) {
    return {
      amount: Math.round(value * 10000) / 10000,
      rate: 1,
      currency_from: fromCurrency,
      currency_base: baseCurrency,
      fx_stale: false,
    }
  }

  const rateEntry = await getRate(baseCurrency, fromCurrency)
  if (!rateEntry || !Number.isFinite(Number(rateEntry.rate)) || Number(rateEntry.rate) <= 0) {
    return {
      amount: null,
      rate: null,
      currency_from: fromCurrency,
      currency_base: baseCurrency,
      fx_stale: true,
    }
  }

  const converted = value / Number(rateEntry.rate)
  return {
    amount: Math.round(converted * 10000) / 10000,
    rate: Number(rateEntry.rate),
    currency_from: fromCurrency,
    currency_base: baseCurrency,
    fx_stale: Boolean(rateEntry.fx_stale || rateEntry.stale),
  }
}

export async function getBaseCurrency() {
  const cfg = await getCurrencyConfig()
  return toCurrency(cfg.defaultBaseCurrency, DEFAULT_BASE)
}

export function extractOriginalPrice(payload = {}) {
  const currency = toCurrency(payload.currencyOriginal || payload.currency || payload.currency_original || DEFAULT_BASE)
  const direct = parseNumberish(payload.priceOriginal ?? payload.price)
  if (Number.isFinite(direct)) {
    return { priceOriginal: direct, currencyOriginal: currency }
  }

  const parsed = parseFirstAmount(payload.price_range || payload.priceRange || payload.target_price || payload.target_fob_price)
  return {
    priceOriginal: Number.isFinite(parsed) ? parsed : null,
    currencyOriginal: currency,
  }
}

export async function refreshRates() {
  const base = await getBaseCurrency()
  const [products, requirements] = await Promise.all([
    readJson('company_products.json'),
    readJson('requirements.json'),
  ])

  const currencies = new Set([base])
  ;[...(Array.isArray(products) ? products : []), ...(Array.isArray(requirements) ? requirements : [])].forEach((row) => {
    const code = toCurrency(row?.currencyOriginal || row?.currency || row?.currency_original || '')
    if (code) currencies.add(code)
  })

  const targets = [...currencies].filter((code) => code && code !== base)
  const refreshed = []
  let fx_stale = false

  for (const quote of targets) {
    const entry = await getRate(base, quote)
    if (!entry) {
      fx_stale = true
      continue
    }
    if (entry.fx_stale || entry.stale) fx_stale = true
    refreshed.push({ quote, rate: entry.rate, stale: Boolean(entry.fx_stale || entry.stale) })
  }

  return {
    base,
    refreshed_count: refreshed.length,
    refreshed,
    fx_stale,
  }
}
