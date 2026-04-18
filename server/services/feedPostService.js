import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'

const FILE = 'feed_posts.json'
const STATUSES = new Set(['draft', 'published'])
const MEDIA_TYPES = new Set(['image', 'video'])

function toSafeArray(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    return value
      .split(/[\n,]/)
      .map((part) => sanitizeString(part, 280))
      .filter(Boolean)
  }
  return []
}

function sanitizeUrl(value, max = 1200) {
  const url = sanitizeString(String(value || ''), max)
  if (!url) return ''
  if (url.startsWith('/uploads/')) return url
  if (url.startsWith('uploads/')) return `/${url}`
  if (/^https?:\/\//i.test(url)) return url
  return ''
}

function normalizeMedia(value) {
  if (!Array.isArray(value)) return []
  const items = value
    .map((entry) => {
      const type = sanitizeString(String(entry?.type || 'image').toLowerCase(), 20)
      if (!MEDIA_TYPES.has(type)) return null
      const url = sanitizeUrl(entry?.url)
      if (!url) return null
      return {
        type,
        url,
        alt: sanitizeString(entry?.alt || '', 240),
      }
    })
    .filter(Boolean)
  return items.slice(0, 10)
}

function normalizePostStatus(value, fallback = 'published') {
  const next = sanitizeString(String(value || fallback), 20).toLowerCase()
  return STATUSES.has(next) ? next : fallback
}

function parseMentions(value) {
  return [...new Set(toSafeArray(value).map((entry) => {
    const raw = String(entry || '').trim()
    return raw.startsWith('@') ? raw : `@${raw}`
  }).filter((entry) => entry !== '@'))].slice(0, 40)
}

function parseHashtags(value) {
  return [...new Set(toSafeArray(value).map((entry) => {
    const raw = String(entry || '').trim().replace(/\s+/g, '')
    return raw.startsWith('#') ? raw : `#${raw}`
  }).filter((entry) => entry !== '#'))].slice(0, 40)
}

function parseEmojis(value) {
  return [...new Set(toSafeArray(value).map((entry) => sanitizeString(entry, 16)).filter(Boolean))].slice(0, 40)
}

function parseLinks(value) {
  return [...new Set(toSafeArray(value).map((entry) => sanitizeUrl(entry)).filter(Boolean))].slice(0, 20)
}

function parseProductTags(value) {
  return [...new Set(toSafeArray(value).map((entry) => sanitizeString(entry, 100)).filter(Boolean))].slice(0, 40)
}

function normalizeFeedPost(ownerId, payload = {}, current = null) {
  const title = sanitizeString(payload.title || current?.title || '', 180)
  if (!title) {
    const err = new Error('Title is required')
    err.status = 400
    throw err
  }

  const descriptionMarkdown = sanitizeString(
    payload.description_markdown !== undefined ? payload.description_markdown : (payload.description || current?.description_markdown || ''),
    40000,
  )

  if (!descriptionMarkdown) {
    const err = new Error('Description is required')
    err.status = 400
    throw err
  }

  const now = new Date().toISOString()
  const next = {
    id: current?.id || crypto.randomUUID(),
    user_id: String(ownerId || current?.user_id || ''),
    title,
    description_markdown: descriptionMarkdown,
    caption: sanitizeString(payload.caption !== undefined ? payload.caption : (current?.caption || ''), 1200),
    cta_text: sanitizeString(payload.cta_text !== undefined ? payload.cta_text : (current?.cta_text || ''), 120),
    cta_url: sanitizeUrl(payload.cta_url !== undefined ? payload.cta_url : (current?.cta_url || '')),
    hashtags: parseHashtags(payload.hashtags !== undefined ? payload.hashtags : (current?.hashtags || [])),
    emojis: parseEmojis(payload.emojis !== undefined ? payload.emojis : (current?.emojis || [])),
    mentions: parseMentions(payload.mentions !== undefined ? payload.mentions : (current?.mentions || [])),
    links: parseLinks(payload.links !== undefined ? payload.links : (current?.links || [])),
    product_tags: parseProductTags(payload.product_tags !== undefined ? payload.product_tags : (current?.product_tags || [])),
    location_tag: sanitizeString(payload.location_tag !== undefined ? payload.location_tag : (current?.location_tag || ''), 180),
    media: normalizeMedia(payload.media !== undefined ? payload.media : (current?.media || [])),
    category: sanitizeString(payload.category !== undefined ? payload.category : (current?.category || ''), 120),
    status: normalizePostStatus(payload.status !== undefined ? payload.status : (current?.status || 'published')),
    created_at: current?.created_at || now,
    updated_at: now,
  }

  return next
}

function canManagePost(actor, post) {
  return String(post?.user_id || '') === String(actor?.id || '')
}

export async function listFeedPosts({ status = 'published', authorId = '', includeDrafts = false } = {}) {
  const rows = await readJson(FILE)
  const targetStatus = sanitizeString(String(status || ''), 20).toLowerCase()
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => {
      if (authorId && String(row.user_id || '') !== String(authorId)) return false
      if (includeDrafts) return true
      if (!targetStatus) return true
      return String(row.status || '').toLowerCase() === targetStatus
    })
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
}

export async function createFeedPost(actor, payload = {}) {
  const ownerId = String(actor?.id || '')
  if (!ownerId) {
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }

  const rows = await readJson(FILE)
  const list = Array.isArray(rows) ? rows : []
  const next = normalizeFeedPost(ownerId, payload)
  await writeJson(FILE, [next, ...list])
  return next
}

export async function updateFeedPost(actor, postId, payload = {}) {
  const rows = await readJson(FILE)
  const list = Array.isArray(rows) ? rows : []
  const idx = list.findIndex((row) => String(row.id || '') === String(postId || ''))
  if (idx < 0) {
    const err = new Error('Feed post not found')
    err.status = 404
    throw err
  }

  const current = list[idx]
  if (!canManagePost(actor, current)) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }

  const updated = normalizeFeedPost(actor.id, payload, current)
  list[idx] = updated
  await writeJson(FILE, list)
  return updated
}

export async function deleteFeedPost(actor, postId) {
  const rows = await readJson(FILE)
  const list = Array.isArray(rows) ? rows : []
  const target = list.find((row) => String(row.id || '') === String(postId || ''))
  if (!target) {
    const err = new Error('Feed post not found')
    err.status = 404
    throw err
  }

  if (!canManagePost(actor, target)) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }

  const next = list.filter((row) => String(row.id || '') !== String(postId || ''))
  await writeJson(FILE, next)
}
