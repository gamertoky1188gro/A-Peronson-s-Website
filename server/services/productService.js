import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { sanitizeString } from '../utils/validators.js'
import { trackEvent } from './analyticsService.js'
import { createNotification, emitNotificationsForEntity } from './notificationService.js'
import { moderateTextOrRedact } from './policyService.js'
import { isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
import { getAdminConfig } from './adminConfigService.js'
import { getPlanForUser } from './entitlementService.js'
import { indexProduct, deleteProductIndex } from './openSearchService.js'

const FILE = 'company_products.json'
const PROHIBITED_MEDIA_KEYWORDS = ['porn', 'explicit', 'nudity', 'violence', 'weapon', 'drugs', 'hate']
const MUSIC_INSTRUMENT_KEYWORDS = [
  'music',
  'song',
  'lyrics',
  'guitar',
  'drum',
  'violin',
  'piano',
  'flute',
  'sitar',
  'tabla',
  'instrument',
]
const PRODUCT_STATUSES = new Set(['draft', 'published'])
const IMAGE_URL_LIMIT = 12
const REVIEW_STATUSES = new Set(['approved', 'pending_review', 'rejected'])

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

function normalizeProductStatus(value, fallback = 'published') {
  const status = sanitizeString(String(value || fallback), 20).toLowerCase()
  return PRODUCT_STATUSES.has(status) ? status : fallback
}

function sanitizeImageUrl(value) {
  return sanitizeString(String(value || ''), 600)
}

function isInternalMediaUrl(value) {
  const raw = sanitizeImageUrl(value)
  if (!raw) return false
  if (raw.startsWith('/uploads/')) return true
  if (raw.startsWith('uploads/')) return true
  if (raw.includes('server/uploads/')) return true
  return false
}

function normalizeImageUrls(value) {
  const cleaned = extractImageUrlCandidates(value)
  return [...new Set(cleaned.filter((url) => Boolean(url && isInternalMediaUrl(url))))].slice(0, IMAGE_URL_LIMIT)
}

function extractImageUrlCandidates(value) {
  const raw = Array.isArray(value)
    ? value
    : (typeof value === 'string' ? value.split(',') : [])
  const cleaned = raw.map((entry) => {
    if (typeof entry === 'string') return sanitizeImageUrl(entry)
    if (entry && typeof entry === 'object') {
      return sanitizeImageUrl(entry.url || entry.source_path || entry.file_path || '')
    }
    return ''
  }).filter(Boolean)
  return cleaned
}

function syncCoverImage(imageUrls, coverImage) {
  const cover = sanitizeImageUrl(coverImage)
  const urls = [...imageUrls]
  if (cover) {
    if (!urls.includes(cover)) urls.unshift(cover)
    return { cover_image_url: cover, image_urls: urls }
  }
  if (!urls.length) return { cover_image_url: '', image_urls: urls }
  return { cover_image_url: urls[0], image_urls: urls }
}

function toPublicFileUrl(filePath = '') {
  if (!filePath) return ''
  const normalized = String(filePath).replace(/\\/g, '/')
  if (normalized.startsWith('/uploads/')) return normalized
  const idx = normalized.indexOf('server/uploads/')
  if (idx >= 0) return `/uploads/${normalized.slice(idx + 'server/uploads/'.length)}`
  return normalized.startsWith('uploads/') ? `/${normalized}` : normalized
}

function buildImageGallery(product, documents = []) {
  const docRows = Array.isArray(documents) ? documents : []
  const relevantDocs = docRows.filter((doc) => {
    if (String(doc.entity_type || '') !== 'company_product') return false
    if (String(doc.entity_id || '') !== String(product.id || '')) return false
    const type = String(doc.type || '').toLowerCase()
    return !type || type.includes('image')
  })

  const docByPath = new Map()
  const docByPublic = new Map()
  relevantDocs.forEach((doc) => {
    const source = String(doc.file_path || doc.url || '')
    if (!source) return
    const publicUrl = toPublicFileUrl(source)
    docByPath.set(source, doc)
    docByPublic.set(publicUrl, doc)
  })

  const storedUrls = normalizeImageUrls(product.image_urls)
  const fallbackUrls = relevantDocs
    .map((doc) => String(doc.file_path || doc.url || ''))
    .filter(Boolean)
  const sources = storedUrls.length ? storedUrls : [...new Set(fallbackUrls)]

  const gallery = sources.map((source) => {
    const doc = docByPath.get(source) || docByPublic.get(source) || null
    const statusRaw = String(doc?.moderation_status || '').toLowerCase()
    const status = statusRaw || (doc ? 'approved' : 'pending_review')
    return {
      url: toPublicFileUrl(source),
      source_path: source,
      document_id: doc?.id || '',
      status,
      flags: Array.isArray(doc?.moderation_flags) ? doc.moderation_flags : [],
    }
  })

  return gallery
}

function assertInternalMediaUrls(urls = [], fieldName = 'media') {
  const bad = urls.filter((url) => url && !isInternalMediaUrl(url))
  if (bad.length) {
    const err = new Error(`Only internal media URLs are allowed for ${fieldName}.`)
    err.status = 400
    throw err
  }
}

function assertInternalMediaUrl(value, fieldName = 'media') {
  if (!value) return
  if (!isInternalMediaUrl(value)) {
    const err = new Error(`Only internal media URLs are allowed for ${fieldName}.`)
    err.status = 400
    throw err
  }
}

function presentProduct(product, documents = [], viewer = {}) {
  const normalized = {
    ...product,
    status: normalizeProductStatus(product.status),
    image_urls: normalizeImageUrls(product.image_urls),
    cover_image_url: sanitizeImageUrl(product.cover_image_url),
  }
  const gallery = buildImageGallery(normalized, documents)
  const isOwner = viewer?.id && String(viewer.id) === String(normalized.company_id)
  const canSeePending = isOwner || isOwnerOrAdmin(viewer)
  const visibleGallery = canSeePending ? gallery : gallery.filter((entry) => entry.status === 'approved')

  const coverSource = sanitizedCover(normalized.cover_image_url)
  const findCover = (items) => items.find((entry) => entry.source_path === coverSource || entry.url === coverSource)
  const coverEntry = findCover(canSeePending ? gallery : visibleGallery)
    || (canSeePending ? gallery[0] : visibleGallery[0])
    || null
  const coverPublicUrl = coverEntry ? coverEntry.url : ''
  const coverSourcePath = coverEntry ? coverEntry.source_path : ''

  return normalizeVideoReview({
    ...normalized,
    status: normalized.status,
    image_urls: canSeePending ? gallery.map((entry) => entry.source_path) : visibleGallery.map((entry) => entry.url),
    cover_image_url: canSeePending ? (coverSource || coverSourcePath) : coverPublicUrl,
    cover_image_public_url: coverPublicUrl,
    image_gallery: canSeePending ? gallery : visibleGallery,
  })
}

function sanitizedCover(value) {
  return sanitizeImageUrl(value)
}

function ensureAgentProductAccess(actor) {
  if (!actor || !isAgent(actor)) return
  if (!actor.permission_matrix?.products?.edit) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }
}

function resolveProductOwner(actor, users = []) {
  if (!actor) return { ownerId: '', ownerRole: '' }
  if (!isAgent(actor)) {
    return { ownerId: actor.id, ownerRole: actor.role }
  }

  ensureAgentProductAccess(actor)
  const ownerId = String(actor.org_owner_id || '')
  if (!ownerId) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }

  const owner = users.find((u) => String(u.id) === ownerId)
  if (!owner) {
    const err = new Error('Organization owner not found')
    err.status = 403
    throw err
  }

  return { ownerId, ownerRole: owner.role || 'buying_house' }
}

async function enforceProductLimits({ owner, allProducts, nextVideoUrl = '' }) {
  if (!owner) return
  const plan = await getPlanForUser(owner)
  if (plan === 'premium') return

  const config = await getAdminConfig()
  const planLimits = config?.plan_limits?.free || {}
  const productLimit = Number(planLimits.product_limit || 20)
  const videoLimit = Number(planLimits.video_limit || 2)

  const ownerId = String(owner.id || '')
  const ownerProducts = Array.isArray(allProducts)
    ? allProducts.filter((p) => String(p.company_id || '') === ownerId)
    : []

  if (productLimit > 0 && ownerProducts.length >= productLimit) {
    const err = new Error(`Free plan allows up to ${productLimit} products. Upgrade to add more.`)
    err.status = 403
    throw err
  }

  if (nextVideoUrl) {
    const existingVideos = ownerProducts.filter((p) => String(p.video_url || '').trim()).length
    if (videoLimit > 0 && existingVideos >= videoLimit) {
      const err = new Error(`Free plan allows up to ${videoLimit} product videos. Upgrade to add more.`)
      err.status = 403
      throw err
    }
  }
}

function getVideoModerationResult({ title = '', description = '', videoUrl = '' }) {
  const hardFlags = []
  const softFlags = []
  if (!videoUrl) {
    return { flags: [], videoReviewStatus: 'approved', videoRestricted: false }
  }

  if (!isInternalMediaUrl(videoUrl)) {
    hardFlags.push('external_video_url_blocked')
  }

  const searchableText = `${title} ${description} ${videoUrl}`.toLowerCase()
  for (const keyword of PROHIBITED_MEDIA_KEYWORDS) {
    if (searchableText.includes(keyword)) {
      hardFlags.push(`prohibited_media_keyword:${keyword}`)
    }
  }

  for (const keyword of MUSIC_INSTRUMENT_KEYWORDS) {
    if (searchableText.includes(keyword)) {
      softFlags.push(`music_or_instrument:${keyword}`)
    }
  }

  const flags = [...hardFlags, ...softFlags]
  const isInternal = isInternalMediaUrl(videoUrl)
  const videoRestricted = flags.length > 0 || isInternal
  const videoReviewStatus = hardFlags.length > 0
    ? 'restricted'
    : (isInternal || softFlags.length > 0 ? 'pending_review' : 'approved')
  return {
    flags,
    videoReviewStatus,
    videoRestricted,
  }
}

function normalizeTerms(list = []) {
  if (!Array.isArray(list)) return []
  return list.map((t) => String(t || '').trim().toLowerCase()).filter(Boolean)
}

function collectTermMatches(text = '', terms = []) {
  if (!text || !terms.length) return []
  const hay = String(text || '').toLowerCase()
  return terms.filter((term) => term && hay.includes(term))
}

function buildReviewReason(template = '', matched = []) {
  const base = template || 'This listing violates our content standards for modest apparel.'
  if (!matched.length) return base
  return `${base} Restricted keyword(s) detected: ${matched.slice(0, 3).join(', ')}.`
}

function resolveReviewStatus(status) {
  const normalized = String(status || 'approved').toLowerCase()
  return REVIEW_STATUSES.has(normalized) ? normalized : 'approved'
}

async function evaluateClothingModeration({ title, description, category, material, media = [] }) {
  const config = await getAdminConfig()
  const rules = config?.moderation?.clothing_rules || {}
  const forbiddenTerms = normalizeTerms(rules.forbidden_terms)
  const flagTerms = normalizeTerms(rules.flag_terms)
  const allowedTerms = normalizeTerms(rules.allowed_terms)
  const exceptions = normalizeTerms(rules.context_exceptions)
  const templates = rules.reason_templates || {}

  const text = [title, description, category, material, ...(media || [])]
    .map((part) => String(part || '').trim())
    .filter(Boolean)
    .join(' ')

  const forbiddenMatches = collectTermMatches(text, forbiddenTerms)
  const flagMatches = collectTermMatches(text, flagTerms)
  const allowedMatches = collectTermMatches(text, allowedTerms)
  const exceptionMatches = collectTermMatches(text, exceptions)
  const hasException = exceptionMatches.length > 0

  if (forbiddenMatches.length && !hasException) {
    return {
      status: 'rejected',
      reason: buildReviewReason(templates.rejected, forbiddenMatches),
      flags: [
        ...forbiddenMatches.map((term) => `forbidden:${term}`),
        ...flagMatches.map((term) => `flag:${term}`),
      ],
    }
  }

  if (flagMatches.length && !hasException) {
    return {
      status: 'pending_review',
      reason: buildReviewReason(templates.pending_review, flagMatches),
      flags: [
        ...flagMatches.map((term) => `flag:${term}`),
        ...allowedMatches.map((term) => `allowed:${term}`),
      ],
    }
  }

  return {
    status: 'approved',
    reason: '',
    flags: [
      ...allowedMatches.map((term) => `allowed:${term}`),
      ...exceptionMatches.map((term) => `exception:${term}`),
    ],
  }
}

export async function createProduct(user, payload) {
  const [all, users] = await Promise.all([
    readJson(FILE),
    readJson('users.json'),
  ])
  const { ownerId, ownerRole } = resolveProductOwner(user, users)
  const ownerUser = users.find((u) => String(u.id) === String(ownerId)) || user
  const title = sanitizeString(payload.title, 120)
  let description = sanitizeString(payload.description || '', 1200)
  const videoUrl = sanitizeString(payload.video_url || '', 260)

  await enforceProductLimits({ owner: ownerUser, allProducts: all, nextVideoUrl: videoUrl })

  const status = normalizeProductStatus(payload.status || 'published')
  const imageCandidates = extractImageUrlCandidates(payload.image_urls || payload.imageUrls)
  const imageUrls = normalizeImageUrls(imageCandidates)
  const coverSeed = sanitizeImageUrl(payload.cover_image_url || payload.coverImageUrl || '')
  assertInternalMediaUrls(imageCandidates, 'product images')
  assertInternalMediaUrl(coverSeed, 'product cover image')
  assertInternalMediaUrl(videoUrl, 'product video')
  const { cover_image_url, image_urls } = syncCoverImage(imageUrls, coverSeed)
  const moderation = getVideoModerationResult({ title, description, videoUrl })
  const clothingReview = await evaluateClothingModeration({
    title,
    description,
    category: sanitizeString(payload.category, 80),
    material: sanitizeString(payload.material, 80),
    media: [videoUrl, coverSeed, ...imageCandidates],
  })
  const row = {
    id: crypto.randomUUID(),
    company_id: ownerId,
    company_role: ownerRole,
    title,
    industry: sanitizeString(payload.industry || '', 80),
    category: sanitizeString(payload.category, 80),
    material: sanitizeString(payload.material, 80),
    moq: sanitizeString(payload.moq || '', 40),
    price_range: sanitizeString(payload.price_range || payload.priceRange || '', 80),
    lead_time_days: sanitizeString(payload.lead_time_days || '', 40),
    fabric_gsm: sanitizeString(payload.fabric_gsm || '', 40),
    size_range: sanitizeString(payload.size_range || '', 120),
    color_pantone: sanitizeString(payload.color_pantone || '', 120),
    customization_capabilities: sanitizeString(payload.customization_capabilities || payload.customization || '', 240),
    sample_available: sanitizeString(payload.sample_available || '', 40),
    sample_lead_time_days: sanitizeString(payload.sample_lead_time_days || '', 40),
    description: '',
    image_urls,
    cover_image_url,
    status,
    video_url: videoUrl,
    video_review_status: moderation.videoReviewStatus,
    video_restricted: moderation.videoRestricted,
    video_moderation_flags: moderation.flags,
    content_review_status: resolveReviewStatus(clothingReview.status),
    content_review_reason: clothingReview.reason || '',
    content_review_flags: clothingReview.flags || [],
    content_reviewed_at: new Date().toISOString(),
    content_reviewed_by: 'system',
    created_at: new Date().toISOString(),
  }

  // Trust & safety (project.md): strip outside-contact sharing / obscene content from descriptions.
  try {
    const moderated = await moderateTextOrRedact({
      actor: user,
      text: description,
      entity_type: 'company_product',
      entity_id: row.id,
    })
    description = moderated.text
    row.moderated = Boolean(moderated.moderated)
    row.moderation_reason = moderated.reason || ''
  } catch {
    // silent
  }

  row.description = description
  all.push(row)
  await writeJson(FILE, all)
  try {
    await indexProduct(row, { ...(ownerUser || {}), ...(ownerUser?.profile || {}) })
  } catch {
    // ignore index failures
  }
  await trackEvent({ type: 'product_created', actor_id: user.id, entity_id: row.id })
  if (status === 'published') {
    await trackEvent({ type: 'product_published', actor_id: user.id, entity_id: row.id })
    if (row.content_review_status === 'approved') {
      await emitNotificationsForEntity('company_product', row)
    }
  }

  if (row.content_review_status !== 'approved') {
    const config = await getAdminConfig()
    const fixTip = config?.moderation?.clothing_rules?.reason_templates?.fix_guidance || ''
    const notice = row.content_review_status === 'rejected'
      ? `Product rejected: ${row.content_review_reason || 'Content standards violation.'} ${fixTip}`.trim()
      : `Product pending review: ${row.content_review_reason || 'Manual review required.'}`.trim()
    await createNotification(ownerId, {
      type: 'product_content_review',
      entity_type: 'company_product',
      entity_id: row.id,
      message: notice,
      meta: { review_status: row.content_review_status, reason: row.content_review_reason },
    })
  }

  const viewer = isAgent(user) ? { id: ownerId, role: ownerRole } : user
  return presentProduct(row, [], viewer)
}

export async function listProducts(filters = {}) {
  const [all, documents] = await Promise.all([
    readJson(FILE),
    readJson('documents.json'),
  ])
  const includeDrafts = Boolean(filters.includeDrafts)
  const viewerId = filters.viewerId || ''
  const viewerRole = filters.viewerRole || ''
  const viewer = viewerId ? { id: viewerId, role: viewerRole } : {}
  return all
    .filter((p) => !filters.category || String(p.category || '').toLowerCase() === String(filters.category).toLowerCase())
    .filter((p) => !filters.companyId || String(p.company_id) === String(filters.companyId))
    .filter((p) => (includeDrafts ? true : normalizeProductStatus(p.status) === 'published'))
    .filter((p) => {
      const reviewStatus = resolveReviewStatus(p.content_review_status)
      if (reviewStatus === 'approved') return true
      if (!viewerId) return false
      if (String(p.company_id) === String(viewerId)) return true
      if (['owner', 'admin'].includes(String(viewerRole || '').toLowerCase())) return true
      return false
    })
    .map((p) => presentProduct(p, documents, viewer))
}

function canMutateProduct(actor, product) {
  if (!actor || !product) return false
  if (isOwnerOrAdmin(actor)) return true
  if (isAgent(actor)) {
    if (!actor.permission_matrix?.products?.edit) return false
    return String(product.company_id) === String(actor.org_owner_id || '')
  }
  return String(product.company_id) === String(actor.id)
}

export async function updateProductById(actor, productId, patch = {}) {
  const id = sanitizeString(String(productId || ''), 120)
  if (!id) return null
  const [all, documents] = await Promise.all([
    readJson(FILE),
    readJson('documents.json'),
  ])
  const idx = all.findIndex((p) => String(p.id) === id)
  if (idx < 0) return null
  const existing = all[idx]
  if (!canMutateProduct(actor, existing)) return 'forbidden'

  const nextTitle = patch.title !== undefined ? sanitizeString(patch.title, 120) : existing.title
  let nextDescription = patch.description !== undefined ? sanitizeString(patch.description || '', 1200) : existing.description
  const nextVideoUrl = patch.video_url !== undefined ? sanitizeString(patch.video_url || '', 260) : existing.video_url
  const ownerId = String(existing.company_id || '')
  const users = await readJson('users.json')
  const ownerRecord = users.find((u) => String(u.id) === ownerId) || actor
  const addingVideo = !String(existing.video_url || '').trim() && String(nextVideoUrl || '').trim()
  if (addingVideo) {
    await enforceProductLimits({ owner: ownerRecord, allProducts: all, nextVideoUrl })
  }
  const moderation = getVideoModerationResult({ title: nextTitle, description: nextDescription, videoUrl: nextVideoUrl })
  const status = patch.status !== undefined ? normalizeProductStatus(patch.status, existing.status || 'published') : normalizeProductStatus(existing.status)
  const imageCandidates = patch.image_urls !== undefined || patch.imageUrls !== undefined
    ? extractImageUrlCandidates(patch.image_urls || patch.imageUrls || [])
    : extractImageUrlCandidates(existing.image_urls)
  const imageUrls = normalizeImageUrls(imageCandidates)
  const coverSeed = patch.cover_image_url !== undefined || patch.coverImageUrl !== undefined
    ? sanitizeImageUrl(patch.cover_image_url || patch.coverImageUrl || '')
    : sanitizeImageUrl(existing.cover_image_url)
  assertInternalMediaUrls(imageCandidates, 'product images')
  assertInternalMediaUrl(coverSeed, 'product cover image')
  assertInternalMediaUrl(nextVideoUrl, 'product video')
  const syncedCover = syncCoverImage(imageUrls, coverSeed)

  try {
    if (patch.description !== undefined) {
      const moderated = await moderateTextOrRedact({
        actor,
        text: nextDescription,
        entity_type: 'company_product',
        entity_id: existing.id,
      })
      nextDescription = moderated.text
    }
  } catch {
    // silent
  }

  const clothingReview = await evaluateClothingModeration({
    title: nextTitle,
    description: nextDescription,
    category: patch.category !== undefined ? sanitizeString(patch.category, 80) : existing.category,
    material: patch.material !== undefined ? sanitizeString(patch.material, 80) : existing.material,
    media: [nextVideoUrl, coverSeed, ...imageCandidates],
  })

  const next = {
    ...existing,
    title: nextTitle,
    industry: patch.industry !== undefined ? sanitizeString(patch.industry, 80) : existing.industry,
    category: patch.category !== undefined ? sanitizeString(patch.category, 80) : existing.category,
    material: patch.material !== undefined ? sanitizeString(patch.material, 80) : existing.material,
    moq: patch.moq !== undefined ? sanitizeString(patch.moq || '', 40) : existing.moq,
    price_range: patch.price_range !== undefined ? sanitizeString(patch.price_range || '', 80) : existing.price_range,
    lead_time_days: patch.lead_time_days !== undefined ? sanitizeString(patch.lead_time_days || '', 40) : existing.lead_time_days,
    fabric_gsm: patch.fabric_gsm !== undefined ? sanitizeString(patch.fabric_gsm || '', 40) : existing.fabric_gsm,
    size_range: patch.size_range !== undefined ? sanitizeString(patch.size_range || '', 120) : existing.size_range,
    color_pantone: patch.color_pantone !== undefined ? sanitizeString(patch.color_pantone || '', 120) : existing.color_pantone,
    customization_capabilities: patch.customization_capabilities !== undefined ? sanitizeString(patch.customization_capabilities || '', 240) : existing.customization_capabilities,
    sample_available: patch.sample_available !== undefined ? sanitizeString(patch.sample_available || '', 40) : existing.sample_available,
    sample_lead_time_days: patch.sample_lead_time_days !== undefined ? sanitizeString(patch.sample_lead_time_days || '', 40) : existing.sample_lead_time_days,
    description: nextDescription,
    image_urls: syncedCover.image_urls,
    cover_image_url: syncedCover.cover_image_url,
    status,
    video_url: nextVideoUrl,
    video_review_status: moderation.videoReviewStatus,
    video_restricted: moderation.videoRestricted,
    video_moderation_flags: moderation.flags,
    content_review_status: resolveReviewStatus(clothingReview.status),
    content_review_reason: clothingReview.reason || '',
    content_review_flags: clothingReview.flags || [],
    content_reviewed_at: new Date().toISOString(),
    content_reviewed_by: 'system',
    updated_at: new Date().toISOString(),
  }

  all[idx] = next
  await writeJson(FILE, all)
  try {
    await indexProduct(next, { ...(ownerRecord || {}), ...(ownerRecord?.profile || {}) })
  } catch {
    // ignore index failures
  }
  await trackEvent({ type: 'product_updated', actor_id: actor.id, entity_id: next.id })
  if ((patch.image_urls !== undefined || patch.imageUrls !== undefined || patch.cover_image_url !== undefined || patch.coverImageUrl !== undefined) && syncedCover.image_urls.length) {
    await trackEvent({ type: 'product_media_updated', actor_id: actor.id, entity_id: next.id })
  }
  if (existing.status !== status && status === 'published') {
    await trackEvent({ type: 'product_published', actor_id: actor.id, entity_id: next.id })
  }
  if (existing.status !== status && status === 'draft') {
    await trackEvent({ type: 'product_unpublished', actor_id: actor.id, entity_id: next.id })
  }
  if (status === 'published' && next.content_review_status === 'approved') {
    // project.md: smart notifications trigger when new matching posts appear.
    await emitNotificationsForEntity('company_product', next)
  }

  if (next.content_review_status !== 'approved') {
    const config = await getAdminConfig()
    const fixTip = config?.moderation?.clothing_rules?.reason_templates?.fix_guidance || ''
    const notice = next.content_review_status === 'rejected'
      ? `Product rejected: ${next.content_review_reason || 'Content standards violation.'} ${fixTip}`.trim()
      : `Product pending review: ${next.content_review_reason || 'Manual review required.'}`.trim()
    await createNotification(ownerId, {
      type: 'product_content_review',
      entity_type: 'company_product',
      entity_id: next.id,
      message: notice,
      meta: { review_status: next.content_review_status, reason: next.content_review_reason },
    })
  }
  return presentProduct(next, documents, actor)
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
  try {
    await deleteProductIndex(id)
  } catch {
    // ignore index failures
  }
  await trackEvent({ type: 'product_deleted', actor_id: actor.id, entity_id: id })
  return true
}
