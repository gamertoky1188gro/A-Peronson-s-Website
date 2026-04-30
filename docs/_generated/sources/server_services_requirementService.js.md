    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { logInfo } from '../utils/logger.js'
    5 | import { createNotification, emitNotificationsForEntity } from './notificationService.js'
    6 | import { recordMilestone } from './ratingsService.js'
    7 | import { moderateTextOrRedact } from './policyService.js'
    8 | import { getPlanForUser } from './entitlementService.js'
    9 | import { indexRequirement, deleteRequirementIndex } from './openSearchService.js'
   10 | import { extractOriginalPrice, getBaseCurrency, normalizePriceRange } from './currencyService.js'
   11 | 
   12 | const FILE = 'requirements.json'
   13 | 
   14 | function buildRequirementSummary(requirement) {
   15 |   if (!requirement) return ''
   16 |   const parts = []
   17 |   const push = (label, value) => {
   18 |     const safe = sanitizeString(value || '', 160)
   19 |     if (!safe) return
   20 |     parts.push(label ? `${label}: ${safe}` : safe)
   21 |   }
   22 | 
   23 |   push('', requirement.title || requirement.category)
   24 |   push('Type', requirement.request_type)
   25 |   push('Category', requirement.category)
   26 |   push('Quantity', requirement.quantity)
   27 |   push('MOQ', requirement.moq)
   28 |   push('Price', requirement.price_range)
   29 |   push('Material', requirement.material)
   30 |   push('GSM', requirement.fabric_gsm)
   31 |   push('Size', requirement.size_range)
   32 |   push('Color', requirement.color_pantone)
   33 |   push('Customization', requirement.customization_capabilities)
   34 |   push('Techpack', requirement.techpack_accepted ? 'Accepted' : '')
   35 |   push('Sample lead time', requirement.sample_lead_time_days || requirement.sample_timeline)
   36 |   push('Lead time', requirement.delivery_timeline || requirement.timeline_days)
   37 |   push('Incoterms', requirement.incoterms)
   38 |   if (requirement.specs && typeof requirement.specs === 'object') {
   39 |     const specs = requirement.specs
   40 |     push('Gender', specs.gender_target)
   41 |     push('Season', specs.season)
   42 |     push('Style', specs.style_description)
   43 |     push('Material type', specs.material_type)
   44 |     push('Unit', specs.unit)
   45 |   }
   46 |   if (Array.isArray(requirement.certifications_required) && requirement.certifications_required.length > 0) {
   47 |     push('Certifications', requirement.certifications_required.join(', '))
   48 |   }
   49 |   push('Compliance', requirement.compliance_details || requirement.compliance_notes)
   50 |   return parts.filter(Boolean).slice(0, 12).join(' | ')
   51 | }
   52 | 
   53 | function normalizeCustomFields(raw = []) {
   54 |   if (!Array.isArray(raw)) return []
   55 |   return raw
   56 |     .map((row) => ({
   57 |       label: sanitizeString(row?.label || '', 120),
   58 |       value: sanitizeString(row?.value || '', 240),
   59 |     }))
   60 |     .filter((row) => row.label || row.value)
   61 | }
   62 | 
   63 | function normalizeDate(value) {
   64 |   if (!value) return null
   65 |   const date = new Date(value)
   66 |   if (Number.isNaN(date.getTime())) return null
   67 |   return date.toISOString()
   68 | }
   69 | 
   70 | function normalizeSpecs(payload = {}, requestType) {
   71 |   const type = String(requestType || '').toLowerCase()
   72 |   if (type === 'textile') {
   73 |     return {
   74 |       material_type: sanitizeString(payload.material_type || '', 120),
   75 |       sub_category: sanitizeString(payload.sub_category || '', 120),
   76 |       unit: sanitizeString(payload.unit || '', 40),
   77 |       fiber_composition: sanitizeString(payload.fiber_composition || '', 160),
   78 |       fabric_weight_gsm: sanitizeString(payload.fabric_weight_gsm || payload.fabric_weight || '', 40),
   79 |       fabric_width: sanitizeString(payload.fabric_width || '', 80),
   80 |       yarn_count: sanitizeString(payload.yarn_count || '', 80),
   81 |       thread_count: sanitizeString(payload.thread_count || '', 80),
   82 |       finish_required: sanitizeString(payload.finish_required || '', 160),
   83 |       stretch_required: sanitizeString(payload.stretch_required || '', 80),
   84 |       color: sanitizeString(payload.color || '', 120),
   85 |       pattern: sanitizeString(payload.pattern || '', 120),
   86 |       price_unit: sanitizeString(payload.price_unit || '', 80),
   87 |       delivery_port: sanitizeString(payload.delivery_port || '', 120),
   88 |       lead_time_required: sanitizeString(payload.lead_time_required || '', 80),
   89 |       lab_test_required: sanitizeString(payload.lab_test_required || '', 160),
   90 |       swatch_first: sanitizeString(payload.swatch_first || '', 40),
   91 |       lab_cert_notes: sanitizeString(payload.lab_cert_notes || '', 240),
   92 |       preferred_factory_location: sanitizeString(payload.preferred_factory_location || '', 120),
   93 |       factory_size_preference: sanitizeString(payload.factory_size_preference || '', 120),
   94 |       export_experience_preference: sanitizeString(payload.export_experience_preference || '', 120),
   95 |       confidentiality_toggle: Boolean(payload.confidentiality_toggle),
   96 |       packaging_requirement: sanitizeString(payload.packaging_requirement || '', 160),
   97 |       origin_label_required: sanitizeString(payload.origin_label_required || '', 160),
   98 |       hangtag_barcode: sanitizeString(payload.hangtag_barcode || '', 160),
   99 |       partial_shipment_allowed: sanitizeString(payload.partial_shipment_allowed || '', 40),
  100 |       shipment_mode: sanitizeString(payload.shipment_mode || '', 40),
  101 |     }
  102 |   }
  103 |   return {
  104 |     gender_target: sanitizeString(payload.gender_target || '', 80),
  105 |     season: sanitizeString(payload.season || '', 80),
  106 |     number_of_styles: sanitizeString(payload.number_of_styles || '', 40),
  107 |     fabric_composition: sanitizeString(payload.fabric_composition || '', 160),
  108 |     fabric_weight_gsm: sanitizeString(payload.fabric_weight_gsm || payload.fabric_weight || '', 40),
  109 |     weave_or_knit: sanitizeString(payload.weave_or_knit || '', 80),
  110 |     size_range: sanitizeString(payload.size_range || payload.size_chart || '', 120),
  111 |     color_requirement: sanitizeString(payload.color_requirement || '', 160),
  112 |     style_description: sanitizeString(payload.style_description || '', 300),
  113 |     tech_pack_required: sanitizeString(payload.tech_pack_required || '', 40),
  114 |     destination_port: sanitizeString(payload.destination_port || '', 120),
  115 |     ex_factory_date: sanitizeString(payload.ex_factory_date || '', 80),
  116 |     sample_required: sanitizeString(payload.sample_required || '', 40),
  117 |     sample_type: sanitizeString(payload.sample_type || '', 80),
  118 |     payment_terms: sanitizeString(payload.payment_terms || '', 120),
  119 |     compliance_certs: Array.isArray(payload.compliance_certs) ? payload.compliance_certs.map((c) => sanitizeString(c, 80)) : [],
  120 |     sustainability_certs: Array.isArray(payload.sustainability_certs) ? payload.sustainability_certs.map((c) => sanitizeString(c, 80)) : [],
  121 |     compliance_notes: sanitizeString(payload.compliance_notes || '', 240),
  122 |     preferred_factory_location: sanitizeString(payload.preferred_factory_location || '', 120),
  123 |     factory_size_preference: sanitizeString(payload.factory_size_preference || '', 120),
  124 |     export_experience_preference: sanitizeString(payload.export_experience_preference || '', 120),
  125 |     confidentiality_toggle: Boolean(payload.confidentiality_toggle),
  126 |     packaging_requirement: sanitizeString(payload.packaging_requirement || '', 160),
  127 |     origin_label_required: sanitizeString(payload.origin_label_required || '', 160),
  128 |     hangtag_barcode: sanitizeString(payload.hangtag_barcode || '', 160),
  129 |     partial_shipment_allowed: sanitizeString(payload.partial_shipment_allowed || '', 40),
  130 |     shipment_mode: sanitizeString(payload.shipment_mode || '', 40),
  131 |   }
  132 | }
  133 | 
  134 | function assertRequiredFields(payload = {}, requestType, status = 'open') {
  135 |   if (String(status || '').toLowerCase() === 'draft') return
  136 |   const missing = []
  137 |   const type = String(requestType || '').toLowerCase()
  138 |   const get = (value) => sanitizeString(value || '', 160)
  139 | 
  140 |   if (type === 'textile') {
  141 |     if (!get(payload.title)) missing.push('title')
  142 |     if (!get(payload.material_type)) missing.push('material_type')
  143 |     if (!get(payload.sub_category)) missing.push('sub_category')
  144 |     if (!get(payload.quantity)) missing.push('quantity')
  145 |     if (!get(payload.unit)) missing.push('unit')
  146 |     if (!get(payload.fiber_composition)) missing.push('fiber_composition')
  147 |     if (!get(payload.fabric_weight_gsm || payload.fabric_weight)) missing.push('fabric_weight_gsm')
  148 |     if (!get(payload.price_range || payload.target_price)) missing.push('target_price')
  149 |     if (!get(payload.price_unit)) missing.push('price_unit')
  150 |     if (!get(payload.incoterms)) missing.push('incoterm')
  151 |     if (!get(payload.delivery_port)) missing.push('delivery_port')
  152 |     if (!get(payload.lead_time_required)) missing.push('lead_time_required')
  153 |   } else {
  154 |     if (!get(payload.title)) missing.push('title')
  155 |     if (!get(payload.category)) missing.push('category')
  156 |     if (!get(payload.gender_target)) missing.push('gender_target')
  157 |     if (!get(payload.season)) missing.push('season')
  158 |     if (!get(payload.quantity)) missing.push('total_quantity')
  159 |     if (!get(payload.price_range || payload.target_fob_price)) missing.push('target_fob_price')
  160 |     if (!get(payload.incoterms)) missing.push('incoterm')
  161 |     if (!get(payload.ex_factory_date)) missing.push('ex_factory_date')
  162 |     if (!get(payload.payment_terms)) missing.push('payment_terms')
  163 |   }
  164 | 
  165 |   if (missing.length) {
  166 |     const error = new Error(`Missing required fields: ${missing.join(', ')}`)
  167 |     error.status = 400
  168 |     throw error
  169 |   }
  170 | }
  171 | 
  172 | function normalizeRequirement(buyerId, payload) {
  173 |   const requestType = sanitizeString(payload.request_type || payload.requestType || 'garments', 40).toLowerCase() === 'textile'
  174 |     ? 'textile'
  175 |     : 'garments'
  176 |   const status = sanitizeString(payload.status || 'open', 20).toLowerCase()
  177 |   assertRequiredFields(payload, requestType, status)
  178 |   const title = sanitizeString(payload.title || payload.request_title || payload.category, 160)
  179 |   const specs = normalizeSpecs(payload, requestType)
  180 |   const customFields = normalizeCustomFields(payload.custom_fields || payload.customFields || [])
  181 |   const normalized = {
  182 |     id: crypto.randomUUID(),
  183 |     buyer_id: buyerId,
  184 |     match_id: sanitizeString(payload.match_id || payload.matchId || '', 240),
  185 |     title,
  186 |     request_type: requestType,
  187 |     verified_only: Boolean(payload.verified_only),
  188 |     specs,
  189 |     custom_fields: customFields,
  190 |     quote_deadline: normalizeDate(payload.quote_deadline),
  191 |     expires_at: normalizeDate(payload.expires_at),
  192 |     max_suppliers: payload.max_suppliers !== undefined && payload.max_suppliers !== null && payload.max_suppliers !== ''
  193 |       ? Number(payload.max_suppliers)
  194 |       : null,
  195 |     // Structured fields (Phase 2). Older UI will continue to use category/material/quantity/etc.
  196 |     product: sanitizeString(payload.product || payload.category, 120),
  197 |     industry: sanitizeString(payload.industry || payload.industry_type || '', 80),
  198 |     category: sanitizeString(payload.category, 120),
  199 |     target_market: sanitizeString(payload.target_market || payload.target || '', 80),
  200 |     quantity: sanitizeString(payload.quantity, 40),
  201 |     moq: sanitizeString(payload.moq || payload.moq_qty || '', 40),
  202 |     price_range: sanitizeString(payload.price_range || payload.target_price || payload.target_fob_price, 80),
  203 |     material: sanitizeString(payload.material || payload.fabric_type, 120),
  204 |     fabric_gsm: sanitizeString(payload.fabric_gsm || payload.gsm || '', 40),
  205 |     timeline_days: sanitizeString(payload.timeline_days, 40),
  206 |     delivery_timeline: sanitizeString(payload.delivery_timeline || payload.delivery || payload.deadline || '', 80),
  207 |     certifications_required: Array.isArray(payload.certifications_required) ? payload.certifications_required.map((c) => sanitizeString(c, 80)) : [],
  208 |     shipping_terms: sanitizeString(payload.shipping_terms || payload.shipping_port || payload.delivery_port || '', 120),
  209 |     incoterms: sanitizeString(payload.incoterms || payload.incoterm || '', 80),
  210 |     payment_terms: sanitizeString(payload.payment_terms || payload.payment || '', 120),
  211 |     document_ready: sanitizeString(payload.document_ready || '', 80),
  212 |     audit_date: sanitizeString(payload.audit_date || '', 80),
  213 |     language_support: sanitizeString(payload.language_support || '', 120),
  214 |     capacity_min: sanitizeString(payload.capacity_min || '', 80),
  215 |     trims_wash: sanitizeString(payload.trims_wash || payload.trims || payload.wash || '', 200),
  216 |     sample_timeline: sanitizeString(payload.sample_timeline || '', 120),
  217 |     sample_available: sanitizeString(payload.sample_available || '', 40),
  218 |     sample_lead_time_days: sanitizeString(payload.sample_lead_time_days || '', 40),
  219 |     packaging: sanitizeString(payload.packaging || '', 200),
  220 |     compliance_notes: sanitizeString(payload.compliance_notes || '', 400),
  221 |     compliance_details: sanitizeString(payload.compliance_details || '', 400),
  222 |     custom_description: sanitizeString(payload.custom_description || '', 1500),
  223 |     size_range: sanitizeString(payload.size_range || payload.size_chart || '', 120),
  224 |     color_pantone: sanitizeString(payload.color_pantone || payload.colors || '', 120),
  225 |     customization_capabilities: sanitizeString(payload.customization_capabilities || payload.customization || '', 240),
  226 |     techpack_accepted: Boolean(payload.techpack_accepted),
  227 |     // Lead ownership / assignment (Buying House flow).
  228 |     assigned_agent_id: sanitizeString(payload.assigned_agent_id || '', 120),
  229 |     assigned_at: sanitizeString(payload.assigned_at || '', 40),
  230 |     assigned_by: sanitizeString(payload.assigned_by || '', 120),
  231 |     status: status || 'open',
  232 |     priority_tier: sanitizeString(payload.priority_tier || '', 40),
  233 |     priority_until: normalizeDate(payload.priority_until),
  234 |     created_at: new Date().toISOString(),
  235 |   }
  236 |   normalized.ai_summary = buildRequirementSummary(normalized)
  237 |   return normalized
  238 | }
  239 | 
  240 | export async function createRequirement(buyerId, payload) {
  241 |   const requirements = await readJson(FILE)
  242 |   const requirement = normalizeRequirement(buyerId, payload)
  243 |   const baseCurrency = await getBaseCurrency()
  244 |   const originalPrice = extractOriginalPrice(payload)
  245 |   const normalizedPrice = await normalizePriceRange({
  246 |     min: originalPrice.priceOriginalMin,
  247 |     max: originalPrice.priceOriginalMax,
  248 |     currency: originalPrice.currency,
  249 |     baseCurrency,
  250 |   })
  251 |   requirement.currency = originalPrice.currency
  252 |   requirement.priceOriginalMin = normalizedPrice.priceOriginalMin
  253 |   requirement.priceOriginalMax = normalizedPrice.priceOriginalMax
  254 |   requirement.priceBaseMin = normalizedPrice.priceBaseMin
  255 |   requirement.priceBaseMax = normalizedPrice.priceBaseMax
  256 |   requirement.priceNormalizedBase = normalizedPrice.priceBaseMin
  257 |   const plan = await getPlanForUser({ id: buyerId })
  258 |   if (plan === 'premium') {
  259 |     requirement.priority_tier = 'priority'
  260 |     requirement.priority_until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  261 |   } else {
  262 |     requirement.priority_tier = 'standard'
  263 |     requirement.priority_until = null
  264 |   }
  265 | 
  266 |   // Trust & safety (project.md): auto-remove outside-contact sharing or obscene text.
  267 |   // We moderate the free-text fields that are most likely to contain contact details.
  268 |   try {
  269 |     const users = await readJson('users.json')
  270 |     const actor = users.find((u) => String(u.id) === String(buyerId)) || null
  271 |     if (actor) {
  272 |       const moderated = await moderateTextOrRedact({
  273 |         actor,
  274 |         text: requirement.custom_description,
  275 |         entity_type: 'buyer_request',
  276 |         entity_id: requirement.id,
  277 |       })
  278 |       requirement.custom_description = moderated.text
  279 |       requirement.moderated = Boolean(moderated.moderated)
  280 |       requirement.moderation_reason = moderated.reason || ''
  281 |     }
  282 |   } catch {
  283 |     // silent: never block creation due to moderation pipeline failures
  284 |   }
  285 | 
  286 |   requirements.push(requirement)
  287 |   await writeJson(FILE, requirements)
  288 |   try {
  289 |     const users = await readJson('users.json')
  290 |     const author = users.find((u) => String(u.id) === String(buyerId)) || null
  291 |     await indexRequirement(requirement, { ...(author || {}), ...(author?.profile || {}) })
  292 |   } catch {
  293 |     // ignore index failures
  294 |   }
  295 |   const isDraft = String(requirement.status || '').toLowerCase() === 'draft'
  296 |   if (!isDraft) {
  297 |     await emitNotificationsForEntity('buyer_request', requirement)
  298 |     try {
  299 |       const users = await readJson('users.json')
  300 |       const targets = users.filter((u) => {
  301 |         const role = String(u.role || '').toLowerCase()
  302 |         return Boolean(u.verified) && (role === 'factory' || role === 'buying_house')
  303 |       })
  304 |       await Promise.all(targets.map((target) => createNotification(target.id, {
  305 |         type: 'buyer_request_verified',
  306 |         entity_type: 'buyer_request',
  307 |         entity_id: requirement.id,
  308 |         message: `New buyer request available (${requirement.request_type || 'garments'}).`,
  309 |         meta: {
  310 |           request_type: requirement.request_type || 'garments',
  311 |           title: requirement.title || '',
  312 |           category: requirement.category || '',
  313 |         },
  314 |       })))
  315 |     } catch {
  316 |       // non-blocking notifications
  317 |     }
  318 |   }
  319 |   logInfo('Buyer request created', { requirement_id: requirement.id, buyer_id: buyerId, status: requirement.status, at: requirement.created_at })
  320 |   return requirement
  321 | }
  322 | 
  323 | export async function listRequirements(filters = {}) {
  324 |   const requirements = await readJson(FILE)
  325 |   return requirements.filter((r) => {
  326 |     if (filters.buyerId && r.buyer_id !== filters.buyerId) return false
  327 |     if (filters.status && r.status !== filters.status) return false
  328 |     return true
  329 |   })
  330 | }
  331 | 
  332 | export async function getRequirementById(id) {
  333 |   const requirements = await readJson(FILE)
  334 |   return requirements.find((r) => r.id === id)
  335 | }
  336 | 
  337 | export async function updateRequirement(requirementId, patch, actor) {
  338 |   const requirements = await readJson(FILE)
  339 |   const idx = requirements.findIndex((r) => r.id === requirementId)
  340 |   if (idx < 0) return null
  341 |   if (actor.role === 'buyer' && requirements[idx].buyer_id !== actor.id) return 'forbidden'
  342 | 
  343 |   const previous = requirements[idx]
  344 |   const actorRole = String(actor?.role || '').toLowerCase()
  345 |   const canAssign = actorRole === 'buying_house' || actorRole === 'owner' || actorRole === 'admin'
  346 | 
  347 |   const requestedAssignedAgentId = patch.assigned_agent_id !== undefined ? sanitizeString(patch.assigned_agent_id || '', 120) : undefined
  348 |   const assignmentChanged = requestedAssignedAgentId !== undefined && requestedAssignedAgentId !== String(previous.assigned_agent_id || '')
  349 |   if (assignmentChanged && !canAssign) return 'forbidden'
  350 | 
  351 |   const nextRequestType = patch.request_type !== undefined || patch.requestType !== undefined
  352 |     ? (sanitizeString(patch.request_type || patch.requestType || previous.request_type || 'garments', 40).toLowerCase() === 'textile' ? 'textile' : 'garments')
  353 |     : (sanitizeString(previous.request_type || 'garments', 40).toLowerCase() === 'textile' ? 'textile' : 'garments')
  354 |   const mergedSpecs = patch.specs !== undefined
  355 |     ? normalizeSpecs(patch.specs, nextRequestType)
  356 |     : normalizeSpecs({ ...previous.specs, ...patch }, nextRequestType)
  357 |   const mergedCustomFields = patch.custom_fields !== undefined || patch.customFields !== undefined
  358 |     ? normalizeCustomFields(patch.custom_fields || patch.customFields || [])
  359 |     : normalizeCustomFields(previous.custom_fields || [])
  360 | 
  361 |   const next = {
  362 |     ...previous,
  363 |     title: patch.title !== undefined ? sanitizeString(patch.title, 160) : (previous.title || ''),
  364 |     request_type: nextRequestType,
  365 |     verified_only: patch.verified_only !== undefined ? Boolean(patch.verified_only) : Boolean(previous.verified_only),
  366 |     specs: mergedSpecs,
  367 |     custom_fields: mergedCustomFields,
  368 |     quote_deadline: patch.quote_deadline !== undefined
  369 |       ? normalizeDate(patch.quote_deadline)
  370 |       : previous.quote_deadline ?? null,
  371 |     expires_at: patch.expires_at !== undefined
  372 |       ? normalizeDate(patch.expires_at)
  373 |       : previous.expires_at ?? null,
  374 |     max_suppliers: patch.max_suppliers !== undefined
  375 |       ? (patch.max_suppliers === null || patch.max_suppliers === '' ? null : Number(patch.max_suppliers))
  376 |       : (previous.max_suppliers ?? null),
  377 |     product: patch.product !== undefined ? sanitizeString(patch.product, 120) : (previous.product || ''),
  378 |     category: patch.category !== undefined ? sanitizeString(patch.category, 120) : requirements[idx].category,
  379 |     industry: patch.industry !== undefined ? sanitizeString(patch.industry, 80) : (previous.industry || ''),
  380 |     target_market: patch.target_market !== undefined ? sanitizeString(patch.target_market, 80) : (previous.target_market || ''),
  381 |     quantity: patch.quantity !== undefined ? sanitizeString(patch.quantity, 40) : requirements[idx].quantity,
  382 |     price_range: patch.price_range !== undefined ? sanitizeString(patch.price_range, 80) : requirements[idx].price_range,
  383 |     material: patch.material !== undefined ? sanitizeString(patch.material, 120) : requirements[idx].material,
  384 |     moq: patch.moq !== undefined ? sanitizeString(patch.moq, 40) : (previous.moq || ''),
  385 |     fabric_gsm: patch.fabric_gsm !== undefined ? sanitizeString(patch.fabric_gsm, 40) : (previous.fabric_gsm || ''),
  386 |     timeline_days: patch.timeline_days !== undefined ? sanitizeString(patch.timeline_days, 40) : requirements[idx].timeline_days,
  387 |     delivery_timeline: patch.delivery_timeline !== undefined ? sanitizeString(patch.delivery_timeline, 80) : (previous.delivery_timeline || ''),
  388 |     certifications_required: patch.certifications_required !== undefined
  389 |       ? (Array.isArray(patch.certifications_required) ? patch.certifications_required.map((c) => sanitizeString(c, 80)) : [])
  390 |       : requirements[idx].certifications_required,
  391 |     shipping_terms: patch.shipping_terms !== undefined ? sanitizeString(patch.shipping_terms, 120) : requirements[idx].shipping_terms,
  392 |     incoterms: patch.incoterms !== undefined ? sanitizeString(patch.incoterms, 80) : (previous.incoterms || ''),
  393 |     payment_terms: patch.payment_terms !== undefined ? sanitizeString(patch.payment_terms, 120) : (previous.payment_terms || ''),
  394 |     document_ready: patch.document_ready !== undefined ? sanitizeString(patch.document_ready, 80) : (previous.document_ready || ''),
  395 |     audit_date: patch.audit_date !== undefined ? sanitizeString(patch.audit_date, 80) : (previous.audit_date || ''),
  396 |     language_support: patch.language_support !== undefined ? sanitizeString(patch.language_support, 120) : (previous.language_support || ''),
  397 |     capacity_min: patch.capacity_min !== undefined ? sanitizeString(patch.capacity_min, 80) : (previous.capacity_min || ''),
  398 |     trims_wash: patch.trims_wash !== undefined ? sanitizeString(patch.trims_wash, 200) : (previous.trims_wash || ''),
  399 |     sample_timeline: patch.sample_timeline !== undefined ? sanitizeString(patch.sample_timeline, 120) : (previous.sample_timeline || ''),
  400 |     sample_available: patch.sample_available !== undefined ? sanitizeString(patch.sample_available, 40) : (previous.sample_available || ''),
  401 |     sample_lead_time_days: patch.sample_lead_time_days !== undefined ? sanitizeString(patch.sample_lead_time_days, 40) : (previous.sample_lead_time_days || ''),
  402 |     packaging: patch.packaging !== undefined ? sanitizeString(patch.packaging, 200) : (previous.packaging || ''),
  403 |     compliance_notes: patch.compliance_notes !== undefined ? sanitizeString(patch.compliance_notes, 400) : (previous.compliance_notes || ''),
  404 |     compliance_details: patch.compliance_details !== undefined ? sanitizeString(patch.compliance_details, 400) : (previous.compliance_details || ''),
  405 |     custom_description: patch.custom_description !== undefined ? sanitizeString(patch.custom_description, 1500) : requirements[idx].custom_description,
  406 |     size_range: patch.size_range !== undefined ? sanitizeString(patch.size_range, 120) : (previous.size_range || ''),
  407 |     color_pantone: patch.color_pantone !== undefined ? sanitizeString(patch.color_pantone, 120) : (previous.color_pantone || ''),
  408 |     customization_capabilities: patch.customization_capabilities !== undefined ? sanitizeString(patch.customization_capabilities, 240) : (previous.customization_capabilities || ''),
  409 |     techpack_accepted: patch.techpack_accepted !== undefined ? Boolean(patch.techpack_accepted) : Boolean(previous.techpack_accepted),
  410 |     status: patch.status !== undefined ? sanitizeString(patch.status, 20) : requirements[idx].status,
  411 |     assigned_agent_id: assignmentChanged ? requestedAssignedAgentId : sanitizeString(previous.assigned_agent_id || '', 120),
  412 |     assigned_at: assignmentChanged ? new Date().toISOString() : sanitizeString(previous.assigned_at || '', 40),
  413 |     assigned_by: assignmentChanged ? sanitizeString(actor.id || '', 120) : sanitizeString(previous.assigned_by || '', 120),
  414 |     priority_tier: patch.priority_tier !== undefined ? sanitizeString(patch.priority_tier || '', 40) : (previous.priority_tier || ''),
  415 |     priority_until: patch.priority_until !== undefined ? normalizeDate(patch.priority_until) : (previous.priority_until || null),
  416 |     match_id: patch.match_id !== undefined ? sanitizeString(patch.match_id || '', 240) : previous.match_id,
  417 |   }
  418 | 
  419 |   const baseCurrency = await getBaseCurrency()
  420 |   const originalPrice = extractOriginalPrice({
  421 |     priceOriginalMin: patch.priceOriginalMin !== undefined ? patch.priceOriginalMin : previous.priceOriginalMin,
  422 |     priceOriginalMax: patch.priceOriginalMax !== undefined ? patch.priceOriginalMax : previous.priceOriginalMax,
  423 |     priceOriginal: patch.priceOriginal !== undefined ? patch.priceOriginal : previous.priceOriginal,
  424 |     currency: patch.currency !== undefined ? patch.currency : (previous.currency || previous.currencyOriginal),
  425 |     price_range: next.price_range,
  426 |   })
  427 |   const normalizedPrice = await normalizePriceRange({
  428 |     min: originalPrice.priceOriginalMin,
  429 |     max: originalPrice.priceOriginalMax,
  430 |     currency: originalPrice.currency,
  431 |     baseCurrency,
  432 |   })
  433 |   next.currency = originalPrice.currency
  434 |   next.priceOriginalMin = normalizedPrice.priceOriginalMin
  435 |   next.priceOriginalMax = normalizedPrice.priceOriginalMax
  436 |   next.priceBaseMin = normalizedPrice.priceBaseMin
  437 |   next.priceBaseMax = normalizedPrice.priceBaseMax
  438 |   next.priceNormalizedBase = normalizedPrice.priceBaseMin
  439 | 
  440 |   assertRequiredFields({
  441 |     ...next,
  442 |     ...next.specs,
  443 |     request_type: next.request_type,
  444 |   }, next.request_type)
  445 | 
  446 |   next.ai_summary = buildRequirementSummary(next)
  447 | 
  448 |   // Trust & safety moderation for updated free-text fields.
  449 |   try {
  450 |     if (patch.custom_description !== undefined) {
  451 |       const moderated = await moderateTextOrRedact({
  452 |         actor,
  453 |         text: next.custom_description,
  454 |         entity_type: 'buyer_request',
  455 |         entity_id: next.id,
  456 |       })
  457 |       next.custom_description = moderated.text
  458 |       next.moderated = Boolean(moderated.moderated)
  459 |       next.moderation_reason = moderated.reason || ''
  460 |     }
  461 |   } catch {
  462 |     // silent
  463 |   }
  464 | 
  465 |   requirements[idx] = next
  466 |   await writeJson(FILE, requirements)
  467 |   try {
  468 |     const users = await readJson('users.json')
  469 |     const author = users.find((u) => String(u.id) === String(next.buyer_id)) || actor
  470 |     await indexRequirement(next, { ...(author || {}), ...(author?.profile || {}) })
  471 |   } catch {
  472 |     // ignore index failures
  473 |   }
  474 |   // project.md: smart notifications trigger when new matching buyer requests appear.
  475 |   // Emit on updates as well so edited requests can match saved alerts.
  476 |   await emitNotificationsForEntity('buyer_request', next)
  477 | 
  478 |   const normalizedStatus = String(next.status || '').toLowerCase()
  479 |   const statusTransitioned = normalizedStatus !== String(previous.status || '').toLowerCase()
  480 |   if (statusTransitioned && ['deal_completed', 'closed', 'fulfilled', 'completed'].includes(normalizedStatus) && patch?.counterparty_id) {
  481 |     await recordMilestone({
  482 |       profileKey: `user:${actor.id}`,
  483 |       counterpartyId: sanitizeString(patch.counterparty_id, 120),
  484 |       interactionType: 'deal',
  485 |       milestone: 'deal_completed',
  486 |       actorId: actor.id,
  487 |     })
  488 |   }
  489 | 
  490 |   return next
  491 | }
  492 | 
  493 | export async function removeRequirement(requirementId, actor) {
  494 |   const requirements = await readJson(FILE)
  495 |   const target = requirements.find((r) => r.id === requirementId)
  496 |   if (!target) return false
  497 |   if (actor.role === 'buyer' && target.buyer_id !== actor.id) return 'forbidden'
  498 |   const next = requirements.filter((r) => r.id !== requirementId)
  499 |   await writeJson(FILE, next)
  500 |   try {
  501 |     await deleteRequirementIndex(requirementId)
  502 |   } catch {
  503 |     // ignore index failures
  504 |   }
  505 |   return true
  506 | }
  507 | 