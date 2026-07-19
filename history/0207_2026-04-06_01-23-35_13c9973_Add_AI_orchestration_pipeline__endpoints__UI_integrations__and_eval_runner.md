## Commit Metadata

- **Hash:** 13c9973de9674576a2317ecdc830fc087e62fb43
- **Parent:** f8989d0cdc924913444832737c159c0d92f37955
- **Author:** Cyber Code Master
- **Date:** 2026-04-06 01:23:35
- **Message:** Add AI orchestration pipeline, endpoints, UI integrations, and eval runner

## Custom Title

Add AI orchestration pipeline, endpoints, UI integrations, and eval runner

## High-Level Summary

Add AI orchestration pipeline, endpoints, UI integrations, and eval runner

10 files changed, 653 insertions(+), 13 deletions(-)

## File-by-File Breakdown

commit 13c9973de9674576a2317ecdc830fc087e62fb43
Author: Cyber Code Master <148459541+gamertoky1188gro@users.noreply.github.com>
Date: Mon Apr 6 01:23:35 2026 +0600

    Add AI orchestration pipeline, endpoints, UI integrations, and eval runner

package.json | 3 +-
scripts/run-ai-extraction-regression.mjs | 34 +++
server/controllers/aiController.js | 50 ++++
server/evals/requirements_extraction_eval_set.json | 41 ++++
server/routes/aiRoutes.js | 12 +
server/server.js | 2 +
server/services/aiOrchestrationService.js | 269 +++++++++++++++++++++
shared/requirementsExtraction.schema.json | 102 ++++++++
src/pages/AgentDashboard.jsx | 84 ++++++-
src/pages/BuyerRequestManagement.jsx | 69 +++++-
10 files changed, 653 insertions(+), 13 deletions(-)

## Detailed Diff Analysis

```diff
diff --git a/package.json b/package.json
index 5db8d11..245f7e1 100644
--- a/package.json
+++ b/package.json
@@ -16,7 +16,8 @@
     "db:migrate:dev": "prisma migrate dev",
     "db:studio": "prisma studio",
     "db:migrate:pg": "prisma migrate dev",
-    "db:backfill:org-operations": "node scripts/db/backfill-org-operations-policies.mjs"
+    "db:backfill:org-operations": "node scripts/db/backfill-org-operations-policies.mjs",
+    "ai:eval": "node scripts/run-ai-extraction-regression.mjs"
   },
   "dependencies": {
     "@fortawesome/fontawesome-free": "^7.2.0",
diff --git a/scripts/run-ai-extraction-regression.mjs b/scripts/run-ai-extraction-regression.mjs
new file mode 100644
index 0000000..ddb9b81
--- /dev/null
+++ b/scripts/run-ai-extraction-regression.mjs
@@ -0,0 +1,34 @@
+import fs from 'fs/promises'
+import path from 'path'
+import { orchestrateRequirementExtraction } from '../server/services/aiOrchestrationService.js'
+
+function scoreCase(result, expected) {
+  let total = 6
+  let hits = 0
+  if (result.requirements?.moq?.value === expected.moq) hits += 1
+  if (result.requirements?.timeline?.normalized_days === expected.timeline_days) hits += 1
+  if (result.requirements?.price?.min === expected.price_min) hits += 1
+  if (result.requirements?.price?.max === expected.price_max) hits += 1
+  if ((result.requirements?.fabric?.material || '').toLowerCase() === String(expected.fabric_material || '').toLowerCase()) hits += 1
+  const certs = result.requirements?.compliance?.certifications || []
+  if ((expected.certifications || []).every((item) => certs.includes(item))) hits += 1
+  return { hits, total, accuracy: hits / total }
+}
+
+const evalPath = path.join(process.cwd(), 'server', 'evals', 'requirements_extraction_eval_set.json')
+const rows = JSON.parse(await fs.readFile(evalPath, 'utf8'))
+
+const byCategory = new Map()
+for (const row of rows) {
+  const result = await orchestrateRequirementExtraction({ text: row.text })
+  const score = scoreCase(result, row.expected)
+  if (!byCategory.has(row.category)) byCategory.set(row.category, [])
+  byCategory.get(row.category).push(score.accuracy)
+  console.log(`${row.id}: ${(score.accuracy * 100).toFixed(1)}%`)
+}
+
+console.log('\nCategory accuracy')
+for (const [category, values] of byCategory.entries()) {
+  const avg = values.reduce((a, b) => a + b, 0) / values.length
+  console.log(`- ${category}: ${(avg * 100).toFixed(1)}%`)
+}
diff --git a/server/controllers/aiController.js b/server/controllers/aiController.js
new file mode 100644
index 0000000..0c18f83
--- /dev/null
+++ b/server/controllers/aiController.js
@@ -0,0 +1,50 @@
+import {
+  orchestrateRequirementExtraction,
+  orchestrateReplyDraft,
+  approveReply,
+  sendReply,
+} from '../services/aiOrchestrationService.js'
+import { handleControllerError } from '../utils/permissions.js'
+
+export async function extractRequirements(req, res) {
+  try {
+    const text = String(req.body?.text || '')
+    const result = await orchestrateRequirementExtraction({ text })
+    return res.json(result)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function draftReply(req, res) {
+  try {
+    const text = String(req.body?.text || '')
+    const result = await orchestrateReplyDraft({ text })
+    return res.json(result)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function approveReplyDraft(req, res) {
+  try {
+    const draft = String(req.body?.draft || '')
+    const extractedRequirements = req.body?.extracted_requirements && typeof req.body.extracted_requirements === 'object'
+      ? req.body.extracted_requirements
+      : {}
+    const allowNumericCommitment = Boolean(req.body?.allow_numeric_commitment)
+    return res.json(approveReply({ draft, extractedRequirements, allowNumericCommitment }))
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
+
+export async function sendApprovedReply(req, res) {
+  try {
+    const draft = String(req.body?.draft || '')
+    const approval = req.body?.approval && typeof req.body.approval === 'object' ? req.body.approval : {}
+    return res.json(sendReply({ draft, approval }))
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
diff --git a/server/evals/requirements_extraction_eval_set.json b/server/evals/requirements_extraction_eval_set.json
new file mode 100644
index 0000000..084016c
--- /dev/null
+++ b/server/evals/requirements_extraction_eval_set.json
@@ -0,0 +1,41 @@
+[
+  {
+    "id": "garments-basic",
+    "category": "garments",
+    "text": "Need 5000 pcs men's polo shirts in 100% cotton 180 gsm. Target price USD 4.5-5.2 FOB. Lead time 45 days. Compliance: BSCI and WRAP.",
+    "expected": {
+      "moq": 5000,
+      "timeline_days": 45,
+      "price_min": 4.5,
+      "price_max": 5.2,
+      "fabric_material": "cotton",
+      "certifications": ["BSCI", "WRAP"]
+    }
+  },
+  {
+    "id": "textile-fabric-roll",
+    "category": "textile",
+    "text": "MOQ 1200 units. Fabric polyester 220 gsm. Budget $2.2 to 2.8. delivery in 6 weeks. Need OEKO-TEX.",
+    "expected": {
+      "moq": 1200,
+      "timeline_days": 42,
+      "price_min": 2.2,
+      "price_max": 2.8,
+      "fabric_material": "polyester",
+      "certifications": ["OEKO-TEX"]
+    }
+  },
+  {
+    "id": "sweater-wool",
+    "category": "garments",
+    "text": "Looking for 3000 pcs wool blend sweaters, target FOB EUR 8.5, lead time 60 days, SA8000 requested.",
+    "expected": {
+      "moq": 3000,
+      "timeline_days": 60,
+      "price_min": 8.5,
+      "price_max": 8.5,
+      "fabric_material": "wool",
+      "certifications": ["SA8000"]
+    }
+  }
+]
diff --git a/server/routes/aiRoutes.js b/server/routes/aiRoutes.js
new file mode 100644
index 0000000..c151d29
--- /dev/null
+++ b/server/routes/aiRoutes.js
@@ -0,0 +1,12 @@
+import { Router } from 'express'
+import { requireAuth } from '../middleware/auth.js'
+import { approveReplyDraft, draftReply, extractRequirements, sendApprovedReply } from '../controllers/aiController.js'
+
+const router = Router()
+
+router.post('/requirements/extract', requireAuth, extractRequirements)
+router.post('/reply/draft', requireAuth, draftReply)
+router.post('/reply/approve', requireAuth, approveReplyDraft)
+router.post('/reply/send', requireAuth, sendApprovedReply)
+
+export default router
diff --git a/server/server.js b/server/server.js
index 44ef459..efa47d5 100644
--- a/server/server.js
+++ b/server/server.js
@@ -45,6 +45,7 @@ import infraRoutes from './routes/infraRoutes.js'
 import networkRoutes from './routes/networkRoutes.js'
 import certificationRoutes from './routes/certificationRoutes.js'
 import crmRoutes from './routes/crmRoutes.js'
+import aiRoutes from './routes/aiRoutes.js'
 import { requestLogger } from './middleware/requestLogger.js'
 import { errorHandler } from './middleware/errorHandler.js'
 import { logInfo, logError } from './utils/logger.js'
@@ -137,6 +138,7 @@ app.use('/api/support', supportRoutes)
 app.use('/api/reports', reportRoutes)
 app.use('/api/certifications', certificationRoutes)
 app.use('/api/crm', crmRoutes)
+app.use('/api/ai', aiRoutes)
 app.use('/api/infra', infraRoutes)
 app.use('/api/network', networkRoutes)
 app.use(errorHandler)
diff --git a/server/services/aiOrchestrationService.js b/server/services/aiOrchestrationService.js
new file mode 100644
index 0000000..c3ef43f
--- /dev/null
+++ b/server/services/aiOrchestrationService.js
@@ -0,0 +1,269 @@
+import fs from 'fs/promises'
+import path from 'path'
+
+const CONFIDENCE_THRESHOLD = 0.65
+const BANNED_INSTRUCTION_PATTERNS = [
+  /ignore\s+previous\s+instructions?/i,
+  /reveal\s+(system|hidden)\s+prompt/i,
+  /share\s+password/i,
+  /wire\s+transfer/i,
+  /off[-\s]?platform\s+payment/i,
+]
+
+const schemaPath = path.join(process.cwd(), 'shared', 'requirementsExtraction.schema.json')
+let schemaCache = null
+
+function normalizeWhitespace(value = '') {
+  return String(value || '').replace(/\s+/g, ' ').trim()
+}
+function extractMOQ(text = '') {
+  const match = text.match(/(?:moq|min(?:imum)?\s+order(?:\s+qty|\s+quantity)?|qty)\s*[:=-]?\s*(\d{2,7})\s*(pcs|pieces|units|sets)?/i)
+  if (!match) return null
+  return {
+    value: Number(match[1]),
+    unit: (match[2] || 'pcs').toLowerCase(),
+    raw: match[0],
+  }
+}
+
+function extractTimeline(text = '') {
+  const dayMatch = text.match(/(?:timeline|delivery|lead\s*time|ship(?:ment)?\s*in)\s*[:=-]?\s*(\d{1,3})\s*(day|days|week|weeks)/i)
+  if (!dayMatch) return null
+  const value = Number(dayMatch[1])
+  const unit = dayMatch[2].toLowerCase()
+  const normalized_days = unit.startsWith('week') ? value * 7 : value
+  return { value, unit, normalized_days, raw: dayMatch[0] }
+}
+
+function extractPrice(text = '') {
+  const rangeMatch = text.match(/(?:price|target|budget|fob)\s*[:=-]?\s*(usd|eur|gbp|bdt|\$|€|£)?\s*(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)/i)
+  if (rangeMatch) {
+    return {
+      min: Number(rangeMatch[2]),
+      max: Number(rangeMatch[3]),
+      currency: (rangeMatch[1] || 'USD').replace('$', 'USD').replace('€', 'EUR').replace('£', 'GBP').toUpperCase(),
+      unit: 'per unit',
+      raw: rangeMatch[0],
+    }
+  }
+
+  const singleMatch = text.match(/(?:price|target|budget|fob)\s*[:=-]?\s*(usd|eur|gbp|bdt|\$|€|£)?\s*(\d+(?:\.\d+)?)/i)
+  if (!singleMatch) return null
+  const value = Number(singleMatch[2])
+  return {
+    min: value,
+    max: value,
+    currency: (singleMatch[1] || 'USD').replace('$', 'USD').replace('€', 'EUR').replace('£', 'GBP').toUpperCase(),
+    unit: 'per unit',
+    raw: singleMatch[0],
+  }
+}
+
+function extractFabric(text = '') {
+  const knownMaterials = ['cotton', 'polyester', 'linen', 'viscose', 'denim', 'spandex', 'nylon', 'wool']
+  const lower = text.toLowerCase()
+  const material = knownMaterials.find((item) => lower.includes(item)) || null
+  const gsmMatch = text.match(/(\d{2,4})\s*gsm/i)
+  const compositionMatch = text.match(/(\d{1,3}%\s*[a-z]+(?:\s*\/\s*\d{1,3}%\s*[a-z]+)*)/i)
+  if (!material && !gsmMatch && !compositionMatch) return null
+  return {
+    material,
+    composition: compositionMatch ? compositionMatch[1] : '',
+    gsm: gsmMatch ? Number(gsmMatch[1]) : null,
+    raw: [material, compositionMatch?.[1], gsmMatch?.[0]].filter(Boolean).join(', '),
+  }
+}
+
+function extractCompliance(text = '') {
+  const certs = ['BSCI', 'WRAP', 'SA8000', 'GOTS', 'OEKO-TEX', 'GRS', 'ISO 9001']
+  const found = certs.filter((cert) => new RegExp(cert.replace('-', '[-\\s]?'), 'i').test(text))
+  const noteMatch = text.match(/(?:compliance|cert(?:ification)?s?|audit)\s*[:=-]?\s*([^.\n]{4,140})/i)
+  if (!found.length && !noteMatch) return null
+  return {
+    certifications: found,
+    notes: noteMatch ? normalizeWhitespace(noteMatch[1]) : '',
+    raw: [found.join(', '), noteMatch?.[0]].filter(Boolean).join(' | '),
+  }
+}
+
+function classifyIntent(text = '') {
+  const lower = text.toLowerCase()
+  if (/quote|pricing|fob|cost/.test(lower)) return 'pricing_request'
+  if (/sample|swatch|develop|tech\s*pack/.test(lower)) return 'sampling_request'
+  if (/urgent|asap|rush|timeline|lead time/.test(lower)) return 'timeline_critical'
+  return 'general_inquiry'
+}
+
+function detectBannedInstruction(text = '') {
+  return BANNED_INSTRUCTION_PATTERNS.some((pattern) => pattern.test(text))
+}
+
+function computeMissingFields(extracted) {
+  const required = ['moq', 'timeline', 'price', 'fabric', 'compliance']
+  return required.filter((field) => !extracted[field])
+}
+
+function computeConfidence(extracted) {
+  const baseFields = ['moq', 'timeline', 'price', 'fabric', 'compliance']
+  const present = baseFields.filter((field) => extracted[field]).length
+  const completeness = present / baseFields.length
+  const detailBoost = extracted.price?.currency && extracted.timeline?.normalized_days ? 0.1 : 0
+  return Math.min(0.99, Number((0.45 + completeness * 0.5 + detailBoost).toFixed(2)))
+}
+
+function buildResponseDraft({ extracted, missingFields, intent }) {
+  const opening = {
+    pricing_request: 'Thank you for sharing the requirement details. We can support your pricing request.',
+    sampling_request: 'Thank you for sharing your sample development request.',
+    timeline_critical: 'Thanks for the details. We noted your timeline-sensitive requirement.',
+    general_inquiry: 'Thank you for your inquiry. We can support this sourcing requirement.',
+  }[intent] || 'Thank you for your inquiry.'
+
+  const detailLines = []
+  if (extracted.moq) detailLines.push(`- MOQ noted: ${extracted.moq.value} ${extracted.moq.unit}`)
+  if (extracted.timeline) detailLines.push(`- Timeline noted: ${extracted.timeline.normalized_days} days`)
+  if (extracted.price) detailLines.push(`- Target price noted: ${extracted.price.currency} ${extracted.price.min}${extracted.price.max !== extracted.price.min ? `-${extracted.price.max}` : ''}`)
+  if (extracted.fabric) detailLines.push(`- Fabric noted: ${extracted.fabric.material || 'specified fabric'}${extracted.fabric.gsm ? `, ${extracted.fabric.gsm} GSM` : ''}`)
+  if (extracted.compliance?.certifications?.length) detailLines.push(`- Compliance noted: ${extracted.compliance.certifications.join(', ')}`)
+
+  const missingLine = missingFields.length
+    ? `Before final confirmation, please share: ${missingFields.join(', ')}.`
+    : 'All core requirement fields are captured. We can proceed to supplier outreach.'
+
+  return `${opening}\n${detailLines.join('\n')}\n${missingLine}`.trim()
+}
+
+function extractNumbersFromText(text = '') {
+  return (String(text || '').match(/\d+(?:\.\d+)?/g) || []).map((n) => Number(n))
+}
+
+function hallucinationCheck(draft = '', extracted = {}) {
+  const allowedNumbers = [
+    extracted.moq?.value,
+    extracted.timeline?.value,
+    extracted.timeline?.normalized_days,
+    extracted.price?.min,
+    extracted.price?.max,
+    extracted.fabric?.gsm,
+  ].filter((value) => Number.isFinite(value))
+  const used = extractNumbersFromText(draft)
+  const disallowed = used.filter((value) => !allowedNumbers.includes(value))
+  return {
+    ok: disallowed.length === 0,
+    disallowed,
+  }
+}
+
+async function loadSchema() {
+  if (schemaCache) return schemaCache
+  const raw = await fs.readFile(schemaPath, 'utf8')
+  schemaCache = JSON.parse(raw)
+  return schemaCache
+}
+
+function validateAgainstSchema(requirements = {}, schema = null) {
+  const errors = []
+  const required = schema?.required || []
+  for (const field of required) {
+    if (!(field in requirements)) errors.push(`Missing required field: ${field}`)
+  }
+
+  if (requirements.moq && (!Number.isFinite(requirements.moq.value) || requirements.moq.value <= 0)) {
+    errors.push('moq.value must be a positive number')
+  }
+  if (requirements.timeline && (!Number.isFinite(requirements.timeline.normalized_days) || requirements.timeline.normalized_days <= 0)) {
+    errors.push('timeline.normalized_days must be a positive number')
+  }
+  if (requirements.price && (!Number.isFinite(requirements.price.min) || !Number.isFinite(requirements.price.max))) {
+    errors.push('price.min and price.max must be numbers')
+  }
+
+  return { valid: errors.length === 0, errors }
+}
+
+export async function orchestrateRequirementExtraction({ text = '' } = {}) {
+  const cleanText = normalizeWhitespace(text)
+  const bannedInstruction = detectBannedInstruction(cleanText)
+  const intent = classifyIntent(cleanText)
+  const requirements = {
+    moq: extractMOQ(cleanText),
+    timeline: extractTimeline(cleanText),
+    price: extractPrice(cleanText),
+    fabric: extractFabric(cleanText),
+    compliance: extractCompliance(cleanText),
+  }
+
+  const missing_fields = computeMissingFields(requirements)
+  const confidence = computeConfidence(requirements)
+  const schema = await loadSchema()
+  const validation = validateAgainstSchema(requirements, schema)
+  const handoff = bannedInstruction || confidence < CONFIDENCE_THRESHOLD || !validation.valid
+
+  return {
+    stage_outputs: {
+      intent_classification: intent,
+      requirement_entity_extraction: requirements,
+      response_draft_generation: buildResponseDraft({ extracted: requirements, missingFields: missing_fields, intent }),
+      confidence_scoring: confidence,
+      handoff_decision: handoff ? 'manual' : 'auto',
+    },
+    requirements: {
+      ...requirements,
+      missing_fields,
+    },
+    confidence,
+    confidence_threshold: CONFIDENCE_THRESHOLD,
+    handoff_mode: handoff ? 'manual' : 'auto',
+    guardrails: {
+      banned_instruction_detected: bannedInstruction,
+      validation_errors: validation.errors,
+    },
+  }
+}
+
+export async function orchestrateReplyDraft({ text = '' } = {}) {
+  const extraction = await orchestrateRequirementExtraction({ text })
+  return {
+    ...extraction,
+    draft: extraction.stage_outputs.response_draft_generation,
+    checklist: extraction.requirements.missing_fields,
+  }
+}
+
+export function approveReply({ draft = '', extractedRequirements = {}, allowNumericCommitment = false } = {}) {
+  const bannedInstruction = detectBannedInstruction(draft)
+  const hallucination = hallucinationCheck(draft, extractedRequirements)
+
+  const blocked = bannedInstruction || (!allowNumericCommitment && !hallucination.ok)
+  return {
+    approved: !blocked,
+    status: blocked ? 'blocked' : 'approved',
+    guardrails: {
+      banned_instruction_detected: bannedInstruction,
+      hallucination_blocked: !hallucination.ok,
+      disallowed_numbers: hallucination.disallowed,
+    },
+    reason: blocked
+      ? 'Reply blocked by safety guardrails. Please edit and retry or switch to manual mode.'
+      : 'Reply approved for sending.',
+  }
+}
+
+export function sendReply({ draft = '', approval = {} } = {}) {
+  if (!approval?.approved) {
+    return {
+      sent: false,
+      status: 'manual_required',
+      message: 'Draft not approved. Please route through manual mode.',
+    }
+  }
+
+  return {
+    sent: true,
+    status: 'sent',
+    sent_at: new Date().toISOString(),
+    payload: {
+      message: normalizeWhitespace(draft),
+    },
+  }
+}
diff --git a/shared/requirementsExtraction.schema.json b/shared/requirementsExtraction.schema.json
new file mode 100644
index 0000000..4adb66a
--- /dev/null
+++ b/shared/requirementsExtraction.schema.json
@@ -0,0 +1,102 @@
+{
+  "$schema": "https://json-schema.org/draft/2020-12/schema",
+  "$id": "https://gartexhub.local/schemas/requirements-extraction.json",
+  "title": "CanonicalExtractedRequirements",
+  "type": "object",
+  "required": ["moq", "timeline", "price", "fabric", "compliance"],
+  "properties": {
+    "moq": {
+      "type": ["object", "null"],
+      "required": ["value", "unit", "raw"],
+      "properties": {
+        "value": { "type": "number", "minimum": 1 },
+        "unit": { "type": "string", "enum": ["pcs", "pieces", "units", "sets"] },
+        "raw": { "type": "string", "minLength": 1 }
+      },
+      "additionalProperties": false,
+      "x-normalization": [
+        "Convert unit aliases to canonical units (pcs, pieces, units, sets).",
+        "Trim whitespace and keep only one raw source span."
+      ]
+    },
+    "timeline": {
+      "type": ["object", "null"],
+      "required": ["value", "unit", "normalized_days", "raw"],
+      "properties": {
+        "value": { "type": "number", "minimum": 1 },
+        "unit": { "type": "string", "enum": ["day", "days", "week", "weeks"] },
+        "normalized_days": { "type": "number", "minimum": 1 },
+        "raw": { "type": "string", "minLength": 1 }
+      },
+      "additionalProperties": false,
+      "x-normalization": [
+        "Normalize timeline to integer day count in normalized_days.",
+        "weeks => value * 7."
+      ]
+    },
+    "price": {
+      "type": ["object", "null"],
+      "required": ["min", "max", "currency", "unit", "raw"],
+      "properties": {
+        "min": { "type": "number", "minimum": 0 },
+        "max": { "type": "number", "minimum": 0 },
+        "currency": { "type": "string", "pattern": "^[A-Z]{3}$" },
+        "unit": { "type": "string" },
+        "raw": { "type": "string", "minLength": 1 }
+      },
+      "additionalProperties": false,
+      "x-normalization": [
+        "Normalize currency symbols ($, €, £) to ISO code.",
+        "If single value is provided, set min=max=value."
+      ]
+    },
+    "fabric": {
+      "type": ["object", "null"],
+      "required": ["material", "composition", "gsm", "raw"],
+      "properties": {
+        "material": { "type": ["string", "null"] },
+        "composition": { "type": "string" },
+        "gsm": { "type": ["number", "null"], "minimum": 1 },
+        "raw": { "type": "string" }
+      },
+      "additionalProperties": false,
+      "x-normalization": [
+        "Lowercase material names and trim composition string.",
+        "Parse numeric GSM when present (e.g. 180 gsm => 180)."
+      ]
+    },
+    "compliance": {
+      "type": ["object", "null"],
+      "required": ["certifications", "notes", "raw"],
+      "properties": {
+        "certifications": {
+          "type": "array",
+          "items": { "type": "string" },
+          "uniqueItems": true
+        },
+        "notes": { "type": "string" },
+        "raw": { "type": "string" }
+      },
+      "additionalProperties": false,
+      "x-normalization": [
+        "Map certification aliases to canonical names (e.g. Oekotex => OEKO-TEX).",
+        "Sort certifications alphabetically for deterministic output."
+      ]
+    },
+    "missing_fields": {
+      "type": "array",
+      "items": {
+        "type": "string",
+        "enum": ["moq", "timeline", "price", "fabric", "compliance"]
+      },
+      "uniqueItems": true
+    }
+  },
+  "additionalProperties": false,
+  "x-validation-rules": [
+    "price.min must be <= price.max.",
+    "timeline.normalized_days must be computed whenever timeline exists.",
+    "All root required keys must exist, and may be null when not extractable."
+  ],
+  "x-optional-fields": ["missing_fields"]
+}
diff --git a/src/pages/AgentDashboard.jsx b/src/pages/AgentDashboard.jsx
index 7846cd6..3ce2bfe 100644
--- a/src/pages/AgentDashboard.jsx
+++ b/src/pages/AgentDashboard.jsx
@@ -12,6 +12,10 @@ export default function AgentDashboard() {
   const [aiSuggestion, setAiSuggestion] = useState('')
   const [aiLoading, setAiLoading] = useState(false)
   const [aiError, setAiError] = useState('')
+  const [aiChecklist, setAiChecklist] = useState([])
+  const [aiExtractedRequirements, setAiExtractedRequirements] = useState({})
+  const [approvalState, setApprovalState] = useState(null)
+  const [sendState, setSendState] = useState(null)
   const [queueSummary, setQueueSummary] = useState({ queue: [] })

   async function generateAiReply() {
@@ -22,11 +26,15 @@ export default function AgentDashboard() {
     }
     setAiLoading(true)
     setAiError('')
+    setApprovalState(null)
+    setSendState(null)
     try {
       const prompt = aiPrompt.trim() || 'Draft a short, professional reply for a textile sourcing conversation. Ask for missing MOQ, price range, and lead time if needed.'
-      const res = await apiRequest('/assistant/ask', { method: 'POST', token, body: { question: prompt } })
-      const reply = String(res?.matched_answer || res?.answer || '').trim()
+      const res = await apiRequest('/ai/reply/draft', { method: 'POST', token, body: { text: prompt } })
+      const reply = String(res?.draft || '').trim()
       setAiSuggestion(reply)
+      setAiChecklist(Array.isArray(res?.checklist) ? res.checklist : [])
+      setAiExtractedRequirements(res?.requirements || {})
       if (!aiPrompt.trim()) setAiPrompt(prompt)
     } catch (err) {
       setAiError(err.message || 'Unable to generate suggestion')
@@ -45,6 +53,52 @@ export default function AgentDashboard() {
     }
   }

+  async function approveSuggestion() {
+    const token = getToken()
+    if (!token || !aiSuggestion) return
+    setAiLoading(true)
+    setAiError('')
+    try {
+      const res = await apiRequest('/ai/reply/approve', {
+        method: 'POST',
+        token,
+        body: {
+          draft: aiSuggestion,
+          extracted_requirements: aiExtractedRequirements,
+        },
+      })
+      setApprovalState(res)
+      if (!res?.approved) setAiError(res?.reason || 'Approval blocked by guardrails.')
+    } catch (err) {
+      setAiError(err.message || 'Unable to approve suggestion.')
+    } finally {
+      setAiLoading(false)
+    }
+  }
+
+  async function sendSuggestion() {
+    const token = getToken()
+    if (!token || !aiSuggestion) return
+    setAiLoading(true)
+    setAiError('')
+    try {
+      const res = await apiRequest('/ai/reply/send', {
+        method: 'POST',
+        token,
+        body: {
+          draft: aiSuggestion,
+          approval: approvalState || {},
+        },
+      })
+      setSendState(res)
+      if (!res?.sent) setAiError(res?.message || 'Send failed.')
+    } catch (err) {
+      setAiError(err.message || 'Unable to send suggestion.')
+    } finally {
+      setAiLoading(false)
+    }
+  }
+
   async function refreshQueueSummary() {
     const token = getToken()
     if (!token) return
@@ -148,14 +202,24 @@ export default function AgentDashboard() {
             {aiError ? <div className="text-xs text-rose-600 mb-2">{aiError}</div> : null}
             {aiSuggestion ? (
               <div className="rounded-lg borderless-shadow bg-slate-50 p-3 text-sm">
-                <p className="whitespace-pre-wrap">{aiSuggestion}</p>
-                <button
-                  type="button"
-                  onClick={copySuggestion}
-                  className="mt-2 text-xs font-semibold text-[#0A66C2] hover:underline"
-                >
-                  Copy suggestion
-                </button>
+                <textarea
+                  className="w-full rounded borderless-shadow bg-white px-2 py-2 whitespace-pre-wrap"
+                  rows={6}
+                  value={aiSuggestion}
+                  onChange={(e) => setAiSuggestion(e.target.value)}
+                />
+                {aiChecklist.length ? (
+                  <div className="mt-2 rounded bg-amber-50 px-2 py-2 text-xs text-amber-700">
+                    Missing-info checklist: {aiChecklist.join(', ')}
+                  </div>
+                ) : null}
+                <div className="mt-2 flex flex-wrap items-center gap-3">
+                  <button type="button" onClick={copySuggestion} className="text-xs font-semibold text-[#0A66C2] hover:underline">Copy suggestion</button>
+                  <button type="button" onClick={approveSuggestion} className="rounded bg-slate-900 px-2 py-1 text-xs font-semibold text-white">Approve draft</button>
+                  <button type="button" onClick={sendSuggestion} className="rounded bg-[#0A66C2] px-2 py-1 text-xs font-semibold text-white">One-click send</button>
+                </div>
+                {approvalState?.status ? <div className="mt-2 text-xs text-slate-600">Approval: {approvalState.status}</div> : null}
+                {sendState?.status ? <div className="mt-1 text-xs text-slate-600">Send status: {sendState.status}</div> : null}
               </div>
             ) : (
               <div className="text-sm text-slate-500">No suggestion yet.</div>
diff --git a/src/pages/BuyerRequestManagement.jsx b/src/pages/BuyerRequestManagement.jsx
index f05f127..243f21e 100644
--- a/src/pages/BuyerRequestManagement.jsx
+++ b/src/pages/BuyerRequestManagement.jsx
@@ -256,6 +256,9 @@ export default function BuyerRequestManagement() {
   const [smartMatches, setSmartMatches] = useState({})
   const [smartMatchLoading, setSmartMatchLoading] = useState('')
   const [smartMatchError, setSmartMatchError] = useState({})
+  const [aiParsing, setAiParsing] = useState(false)
+  const [aiParseWarnings, setAiParseWarnings] = useState([])
+  const [aiParseFeedback, setAiParseFeedback] = useState('')

   const [editingId, setEditingId] = useState('')
   const [editForm, setEditForm] = useState(EMPTY_FORM)
@@ -426,6 +429,54 @@ export default function BuyerRequestManagement() {
     await createRequest('draft')
   }

+  async function parseDescriptionWithAi() {
+    if (!token) return
+    if (!form.customDescription.trim()) {
+      setAiParseFeedback('Please enter request text in Custom description first.')
+      return
+    }
+    setAiParsing(true)
+    setAiParseWarnings([])
+    setAiParseFeedback('')
+    try {
+      const response = await apiRequest('/ai/requirements/extract', {
+        method: 'POST',
+        token,
+        body: { text: form.customDescription },
+      })
+      const extracted = response?.requirements || {}
+      const missing = Array.isArray(extracted.missing_fields) ? extracted.missing_fields : []
+      setAiParseWarnings(missing)
+
+      const timelineDays = extracted?.timeline?.normalized_days
+      const priceMin = extracted?.price?.min
+      const priceMax = extracted?.price?.max
+      const priceCurrency = extracted?.price?.currency || 'USD'
+
+      setForm((prev) => ({
+        ...prev,
+        targetFobPrice: Number.isFinite(priceMin)
+          ? `${priceCurrency} ${priceMin}${Number.isFinite(priceMax) && priceMax !== priceMin ? `-${priceMax}` : ''}`
+          : prev.targetFobPrice,
+        targetPrice: Number.isFinite(priceMin)
+          ? `${priceCurrency} ${priceMin}${Number.isFinite(priceMax) && priceMax !== priceMin ? `-${priceMax}` : ''}`
+          : prev.targetPrice,
+        fabricComposition: extracted?.fabric?.composition || extracted?.fabric?.material || prev.fabricComposition,
+        fiberComposition: extracted?.fabric?.composition || extracted?.fabric?.material || prev.fiberComposition,
+        fabricWeightGsm: Number.isFinite(extracted?.fabric?.gsm) ? String(extracted.fabric.gsm) : prev.fabricWeightGsm,
+        complianceNotes: extracted?.compliance?.notes || prev.complianceNotes,
+        leadTimeRequired: Number.isFinite(timelineDays) ? `${timelineDays} days` : prev.leadTimeRequired,
+      }))
+
+      const confidence = Number(response?.confidence || 0)
+      setAiParseFeedback(`AI parsed your text (confidence ${Math.round(confidence * 100)}%).`)
+    } catch (err) {
+      setAiParseFeedback(err.message || 'AI parsing failed.')
+    } finally {
+      setAiParsing(false)
+    }
+  }
+
   function startEditing(req) {
     setEditingId(req.id)
     setEditForm(requirementToForm(req))
@@ -1029,6 +1080,22 @@ export default function BuyerRequestManagement() {

                 <Field label="Custom description" hint="Use this for extra notes, design details, or negotiation context.">
                   <textarea className="w-full min-h-[140px] rounded-lg borderless-shadow px-3 py-2" value={form.customDescription} onChange={(e) => setForm({ ...form, customDescription: e.target.value })} />
+                  <div className="mt-2 flex flex-wrap items-center gap-2">
+                    <button
+                      type="button"
+                      onClick={parseDescriptionWithAi}
+                      disabled={aiParsing || !form.customDescription.trim()}
+                      className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
+                    >
+                      {aiParsing ? 'Parsing...' : 'AI parse my text'}
+                    </button>
+                    {aiParseFeedback ? <span className="text-xs text-slate-600">{aiParseFeedback}</span> : null}
+                  </div>
+                  {aiParseWarnings.length ? (
+                    <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
+                      Missing data confidence warning: {aiParseWarnings.join(', ')}
+                    </div>
+                  ) : null}
                 </Field>

             </div>
@@ -1406,5 +1473,3 @@ export default function BuyerRequestManagement() {



-
-
```

## Why This Change

Add AI orchestration pipeline, endpoints, UI integrations, and eval runner

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 10 files changed, 653 insertions(+), 13 deletions(-)
- **Risk:** Moderate

## Relationships

Commit 207 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
