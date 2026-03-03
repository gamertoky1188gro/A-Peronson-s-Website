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
    .map((p) => normalizeVideoReview(p))
}
