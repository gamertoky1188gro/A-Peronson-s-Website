import fs from 'fs/promises'
import path from 'path'

const CONFIDENCE_THRESHOLD = 0.65
const BANNED_INSTRUCTION_PATTERNS = [
  /ignore\s+previous\s+instructions?/i,
  /reveal\s+(system|hidden)\s+prompt/i,
  /share\s+password/i,
  /wire\s+transfer/i,
  /off[-\s]?platform\s+payment/i,
]

const schemaPath = path.join(process.cwd(), 'shared', 'requirementsExtraction.schema.json')
let schemaCache = null

function normalizeWhitespace(value = '') {
  return String(value || '').replace(/\s+/g, ' ').trim()
}
function extractMOQ(text = '') {
  const match = text.match(/(?:moq|min(?:imum)?\s+order(?:\s+qty|\s+quantity)?|qty)\s*[:=-]?\s*(\d{2,7})\s*(pcs|pieces|units|sets)?/i)
  if (!match) return null
  return {
    value: Number(match[1]),
    unit: (match[2] || 'pcs').toLowerCase(),
    raw: match[0],
  }
}

function extractTimeline(text = '') {
  const dayMatch = text.match(/(?:timeline|delivery|lead\s*time|ship(?:ment)?\s*in)\s*[:=-]?\s*(\d{1,3})\s*(day|days|week|weeks)/i)
  if (!dayMatch) return null
  const value = Number(dayMatch[1])
  const unit = dayMatch[2].toLowerCase()
  const normalized_days = unit.startsWith('week') ? value * 7 : value
  return { value, unit, normalized_days, raw: dayMatch[0] }
}

function extractPrice(text = '') {
  const rangeMatch = text.match(/(?:price|target|budget|fob)\s*[:=-]?\s*(usd|eur|gbp|bdt|\$|€|£)?\s*(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)/i)
  if (rangeMatch) {
    return {
      min: Number(rangeMatch[2]),
      max: Number(rangeMatch[3]),
      currency: (rangeMatch[1] || 'USD').replace('$', 'USD').replace('€', 'EUR').replace('£', 'GBP').toUpperCase(),
      unit: 'per unit',
      raw: rangeMatch[0],
    }
  }

  const singleMatch = text.match(/(?:price|target|budget|fob)\s*[:=-]?\s*(usd|eur|gbp|bdt|\$|€|£)?\s*(\d+(?:\.\d+)?)/i)
  if (!singleMatch) return null
  const value = Number(singleMatch[2])
  return {
    min: value,
    max: value,
    currency: (singleMatch[1] || 'USD').replace('$', 'USD').replace('€', 'EUR').replace('£', 'GBP').toUpperCase(),
    unit: 'per unit',
    raw: singleMatch[0],
  }
}

function extractFabric(text = '') {
  const knownMaterials = ['cotton', 'polyester', 'linen', 'viscose', 'denim', 'spandex', 'nylon', 'wool']
  const lower = text.toLowerCase()
  const material = knownMaterials.find((item) => lower.includes(item)) || null
  const gsmMatch = text.match(/(\d{2,4})\s*gsm/i)
  const compositionMatch = text.match(/(\d{1,3}%\s*[a-z]+(?:\s*\/\s*\d{1,3}%\s*[a-z]+)*)/i)
  if (!material && !gsmMatch && !compositionMatch) return null
  return {
    material,
    composition: compositionMatch ? compositionMatch[1] : '',
    gsm: gsmMatch ? Number(gsmMatch[1]) : null,
    raw: [material, compositionMatch?.[1], gsmMatch?.[0]].filter(Boolean).join(', '),
  }
}

function extractCompliance(text = '') {
  const certs = ['BSCI', 'WRAP', 'SA8000', 'GOTS', 'OEKO-TEX', 'GRS', 'ISO 9001']
  const found = certs.filter((cert) => new RegExp(cert.replace('-', '[-\\s]?'), 'i').test(text))
  const noteMatch = text.match(/(?:compliance|cert(?:ification)?s?|audit)\s*[:=-]?\s*([^.\n]{4,140})/i)
  if (!found.length && !noteMatch) return null
  return {
    certifications: found,
    notes: noteMatch ? normalizeWhitespace(noteMatch[1]) : '',
    raw: [found.join(', '), noteMatch?.[0]].filter(Boolean).join(' | '),
  }
}

function classifyIntent(text = '') {
  const lower = text.toLowerCase()
  if (/quote|pricing|fob|cost/.test(lower)) return 'pricing_request'
  if (/sample|swatch|develop|tech\s*pack/.test(lower)) return 'sampling_request'
  if (/urgent|asap|rush|timeline|lead time/.test(lower)) return 'timeline_critical'
  return 'general_inquiry'
}

function detectBannedInstruction(text = '') {
  return BANNED_INSTRUCTION_PATTERNS.some((pattern) => pattern.test(text))
}

function computeMissingFields(extracted) {
  const required = ['moq', 'timeline', 'price', 'fabric', 'compliance']
  return required.filter((field) => !extracted[field])
}

function computeConfidence(extracted) {
  const baseFields = ['moq', 'timeline', 'price', 'fabric', 'compliance']
  const present = baseFields.filter((field) => extracted[field]).length
  const completeness = present / baseFields.length
  const detailBoost = extracted.price?.currency && extracted.timeline?.normalized_days ? 0.1 : 0
  return Math.min(0.99, Number((0.45 + completeness * 0.5 + detailBoost).toFixed(2)))
}

function buildResponseDraft({ extracted, missingFields, intent }) {
  const opening = {
    pricing_request: 'Thank you for sharing the requirement details. We can support your pricing request.',
    sampling_request: 'Thank you for sharing your sample development request.',
    timeline_critical: 'Thanks for the details. We noted your timeline-sensitive requirement.',
    general_inquiry: 'Thank you for your inquiry. We can support this sourcing requirement.',
  }[intent] || 'Thank you for your inquiry.'

  const detailLines = []
  if (extracted.moq) detailLines.push(`- MOQ noted: ${extracted.moq.value} ${extracted.moq.unit}`)
  if (extracted.timeline) detailLines.push(`- Timeline noted: ${extracted.timeline.normalized_days} days`)
  if (extracted.price) detailLines.push(`- Target price noted: ${extracted.price.currency} ${extracted.price.min}${extracted.price.max !== extracted.price.min ? `-${extracted.price.max}` : ''}`)
  if (extracted.fabric) detailLines.push(`- Fabric noted: ${extracted.fabric.material || 'specified fabric'}${extracted.fabric.gsm ? `, ${extracted.fabric.gsm} GSM` : ''}`)
  if (extracted.compliance?.certifications?.length) detailLines.push(`- Compliance noted: ${extracted.compliance.certifications.join(', ')}`)

  const missingLine = missingFields.length
    ? `Before final confirmation, please share: ${missingFields.join(', ')}.`
    : 'All core requirement fields are captured. We can proceed to supplier outreach.'

  return `${opening}\n${detailLines.join('\n')}\n${missingLine}`.trim()
}

function extractNumbersFromText(text = '') {
  return (String(text || '').match(/\d+(?:\.\d+)?/g) || []).map((n) => Number(n))
}

function hallucinationCheck(draft = '', extracted = {}) {
  const allowedNumbers = [
    extracted.moq?.value,
    extracted.timeline?.value,
    extracted.timeline?.normalized_days,
    extracted.price?.min,
    extracted.price?.max,
    extracted.fabric?.gsm,
  ].filter((value) => Number.isFinite(value))
  const used = extractNumbersFromText(draft)
  const disallowed = used.filter((value) => !allowedNumbers.includes(value))
  return {
    ok: disallowed.length === 0,
    disallowed,
  }
}

async function loadSchema() {
  if (schemaCache) return schemaCache
  const raw = await fs.readFile(schemaPath, 'utf8')
  schemaCache = JSON.parse(raw)
  return schemaCache
}

function validateAgainstSchema(requirements = {}, schema = null) {
  const errors = []
  const required = schema?.required || []
  for (const field of required) {
    if (!(field in requirements)) errors.push(`Missing required field: ${field}`)
  }

  if (requirements.moq && (!Number.isFinite(requirements.moq.value) || requirements.moq.value <= 0)) {
    errors.push('moq.value must be a positive number')
  }
  if (requirements.timeline && (!Number.isFinite(requirements.timeline.normalized_days) || requirements.timeline.normalized_days <= 0)) {
    errors.push('timeline.normalized_days must be a positive number')
  }
  if (requirements.price && (!Number.isFinite(requirements.price.min) || !Number.isFinite(requirements.price.max))) {
    errors.push('price.min and price.max must be numbers')
  }

  return { valid: errors.length === 0, errors }
}

export async function orchestrateRequirementExtraction({ text = '' } = {}) {
  const cleanText = normalizeWhitespace(text)
  const bannedInstruction = detectBannedInstruction(cleanText)
  const intent = classifyIntent(cleanText)
  const requirements = {
    moq: extractMOQ(cleanText),
    timeline: extractTimeline(cleanText),
    price: extractPrice(cleanText),
    fabric: extractFabric(cleanText),
    compliance: extractCompliance(cleanText),
  }

  const missing_fields = computeMissingFields(requirements)
  const confidence = computeConfidence(requirements)
  const schema = await loadSchema()
  const validation = validateAgainstSchema(requirements, schema)
  const handoff = bannedInstruction || confidence < CONFIDENCE_THRESHOLD || !validation.valid

  return {
    stage_outputs: {
      intent_classification: intent,
      requirement_entity_extraction: requirements,
      response_draft_generation: buildResponseDraft({ extracted: requirements, missingFields: missing_fields, intent }),
      confidence_scoring: confidence,
      handoff_decision: handoff ? 'manual' : 'auto',
    },
    requirements: {
      ...requirements,
      missing_fields,
    },
    confidence,
    confidence_threshold: CONFIDENCE_THRESHOLD,
    handoff_mode: handoff ? 'manual' : 'auto',
    guardrails: {
      banned_instruction_detected: bannedInstruction,
      validation_errors: validation.errors,
    },
  }
}

export async function orchestrateReplyDraft({ text = '' } = {}) {
  const extraction = await orchestrateRequirementExtraction({ text })
  return {
    ...extraction,
    draft: extraction.stage_outputs.response_draft_generation,
    checklist: extraction.requirements.missing_fields,
  }
}

export function approveReply({ draft = '', extractedRequirements = {}, allowNumericCommitment = false } = {}) {
  const bannedInstruction = detectBannedInstruction(draft)
  const hallucination = hallucinationCheck(draft, extractedRequirements)

  const blocked = bannedInstruction || (!allowNumericCommitment && !hallucination.ok)
  return {
    approved: !blocked,
    status: blocked ? 'blocked' : 'approved',
    guardrails: {
      banned_instruction_detected: bannedInstruction,
      hallucination_blocked: !hallucination.ok,
      disallowed_numbers: hallucination.disallowed,
    },
    reason: blocked
      ? 'Reply blocked by safety guardrails. Please edit and retry or switch to manual mode.'
      : 'Reply approved for sending.',
  }
}

export function sendReply({ draft = '', approval = {} } = {}) {
  if (!approval?.approved) {
    return {
      sent: false,
      status: 'manual_required',
      message: 'Draft not approved. Please route through manual mode.',
    }
  }

  return {
    sent: true,
    status: 'sent',
    sent_at: new Date().toISOString(),
    payload: {
      message: normalizeWhitespace(draft),
    },
  }
}
