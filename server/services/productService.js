import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { trackEvent } from './analyticsService.js'
import { emitNotificationsForEntity } from './notificationService.js'

const FILE = 'company_products.json'
const PROHIBITED_MEDIA_KEYWORDS = ['porn', 'explicit', 'nudity', 'violence', 'weapon', 'drugs', 'hate']
const TRUSTED_VIDEO_HOSTS = ['youtube.com', 'youtu.be', 'vimeo.com', 'loom.com', 'drive.google.com']

function normalizeVideoReview(row) {
  const reviewStatus = row.video_review_status || 'approved'
  const restricted = Boolean(row.video_restricted || reviewStatus !== 'approved')
  return {
    ...row,
    video_review_status: reviewStatus,
    video_restricted: restricted,
    video_moderation_flags: Array.isArray(row.video_moderation_flags) ? row.video_moderation_flags : [],
    video_url: restricted ? '' : row.video_url,
    hasVideo: !restricted && Boolean(row.video_url),
  }
}

function getVideoModerationResult({ title = '', description = '', videoUrl = '' }) {
  const flags = []
  if (!videoUrl) {
    return { flags, videoReviewStatus: 'approved', videoRestricted: false }
  }

  let parsed = null
  try {
    parsed = new URL(videoUrl)
  } catch {
    flags.push('invalid_video_url')
  }

  if (parsed && !['http:', 'https:'].includes(parsed.protocol)) {
    flags.push('invalid_video_protocol')
  }

  if (parsed) {
    const host = parsed.hostname.toLowerCase()
    if (!TRUSTED_VIDEO_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))) {
      flags.push('untrusted_video_host')
    }
  }

  const searchableText = `${title} ${description} ${videoUrl}`.toLowerCase()
  for (const keyword of PROHIBITED_MEDIA_KEYWORDS) {
    if (searchableText.includes(keyword)) {
      flags.push(`prohibited_media_keyword:${keyword}`)
    }
  }

  const videoRestricted = flags.length > 0
  return {
    flags,
    videoReviewStatus: videoRestricted ? 'restricted' : 'pending_review',
    videoRestricted,
  }
}

export async function createProduct(user, payload) {
  const all = await readJson(FILE)
  const title = sanitizeString(payload.title, 120)
  const description = sanitizeString(payload.description || '', 1200)
  const videoUrl = sanitizeString(payload.video_url || '', 260)
  const moderation = getVideoModerationResult({ title, description, videoUrl })
  const row = {
    id: crypto.randomUUID(),
    company_id: user.id,
    company_role: user.role,
    title,
    category: sanitizeString(payload.category, 80),
    material: sanitizeString(payload.material, 80),
    moq: sanitizeString(payload.moq || '', 40),
    lead_time_days: sanitizeString(payload.lead_time_days || '', 40),
    description,
    video_url: videoUrl,
    video_review_status: moderation.videoReviewStatus,
    video_restricted: moderation.videoRestricted,
    video_moderation_flags: moderation.flags,
    created_at: new Date().toISOString(),
  }
  all.push(row)
  await writeJson(FILE, all)
  await trackEvent({ type: 'product_created', actor_id: user.id, entity_id: row.id })
  await emitNotificationsForEntity('company_product', row)
  return normalizeVideoReview(row)
}

export async function listProducts(filters = {}) {
  const all = await readJson(FILE)
  return all
    .filter((p) => !filters.category || p.category.toLowerCase() === String(filters.category).toLowerCase())
    .filter((p) => !filters.companyId || String(p.company_id) === String(filters.companyId))
    .map((p) => normalizeVideoReview(p))
}

function canMutateProduct(actor, product) {
  if (!actor || !product) return false
  if (actor.role === 'admin' || actor.role === 'owner') return true
  return String(product.company_id) === String(actor.id)
}

export async function updateProductById(actor, productId, patch = {}) {
  const id = sanitizeString(String(productId || ''), 120)
  if (!id) return null
  const all = await readJson(FILE)
  const idx = all.findIndex((p) => String(p.id) === id)
  if (idx < 0) return null
  const existing = all[idx]
  if (!canMutateProduct(actor, existing)) return 'forbidden'

  const nextTitle = patch.title !== undefined ? sanitizeString(patch.title, 120) : existing.title
  const nextDescription = patch.description !== undefined ? sanitizeString(patch.description || '', 1200) : existing.description
  const nextVideoUrl = patch.video_url !== undefined ? sanitizeString(patch.video_url || '', 260) : existing.video_url
  const moderation = getVideoModerationResult({ title: nextTitle, description: nextDescription, videoUrl: nextVideoUrl })

  const next = {
    ...existing,
    title: nextTitle,
    category: patch.category !== undefined ? sanitizeString(patch.category, 80) : existing.category,
    material: patch.material !== undefined ? sanitizeString(patch.material, 80) : existing.material,
    moq: patch.moq !== undefined ? sanitizeString(patch.moq || '', 40) : existing.moq,
    lead_time_days: patch.lead_time_days !== undefined ? sanitizeString(patch.lead_time_days || '', 40) : existing.lead_time_days,
    description: nextDescription,
    video_url: nextVideoUrl,
    video_review_status: moderation.videoReviewStatus,
    video_restricted: moderation.videoRestricted,
    video_moderation_flags: moderation.flags,
    updated_at: new Date().toISOString(),
  }

  all[idx] = next
  await writeJson(FILE, all)
  await trackEvent({ type: 'product_updated', actor_id: actor.id, entity_id: next.id })
  return normalizeVideoReview(next)
}

export async function removeProduct(actor, productId) {
  const id = sanitizeString(String(productId || ''), 120)
  if (!id) return null
  const all = await readJson(FILE)
  const existing = all.find((p) => String(p.id) === id)
  if (!existing) return null
  if (!canMutateProduct(actor, existing)) return 'forbidden'
  const next = all.filter((p) => String(p.id) !== id)
  await writeJson(FILE, next)
  await trackEvent({ type: 'product_deleted', actor_id: actor.id, entity_id: id })
  return true
}
