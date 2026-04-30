    1 | import crypto from 'crypto'
    2 | import prisma from '../utils/prisma.js'
    3 | import { readLocalJson, writeLocalJson } from '../utils/localStore.js'
    4 | import { sanitizeString } from '../utils/validators.js'
    5 | import {
    6 |   WORKFLOW_LIFECYCLE_STATES,
    7 |   normalizeWorkflowLifecycleState,
    8 |   validateWorkflowLifecycleTransition,
    9 | } from '../../shared/workflowLifecycle.js'
   10 | 
   11 | const JOURNEYS_FILE = 'workflow_journeys.json'
   12 | const TRANSITIONS_FILE = 'workflow_transitions.json'
   13 | const AUDIT_FILE = 'workflow_audit_logs.json'
   14 | 
   15 | function nowIso() {
   16 |   return new Date().toISOString()
   17 | }
   18 | 
   19 | function supportsPrismaWorkflow() {
   20 |   return Boolean(prisma?.workflowJourney && prisma?.workflowTransition)
   21 | }
   22 | 
   23 | function normalizeJourney(journey = {}) {
   24 |   return {
   25 |     id: sanitizeString(journey.id, 120) || crypto.randomUUID(),
   26 |     match_id: sanitizeString(journey.match_id, 120),
   27 |     requirement_id: sanitizeString(journey.requirement_id, 120),
   28 |     product_id: sanitizeString(journey.product_id, 120),
   29 |     contract_id: sanitizeString(journey.contract_id, 120),
   30 |     current_state: normalizeWorkflowLifecycleState(journey.current_state, 'discovered'),
   31 |     created_at: sanitizeString(journey.created_at, 80) || nowIso(),
   32 |     updated_at: sanitizeString(journey.updated_at, 80) || nowIso(),
   33 |   }
   34 | }
   35 | 
   36 | function normalizeTransition(transition = {}) {
   37 |   return {
   38 |     id: sanitizeString(transition.id, 120) || crypto.randomUUID(),
   39 |     journey_id: sanitizeString(transition.journey_id, 120),
   40 |     from_state: normalizeWorkflowLifecycleState(transition.from_state, 'discovered'),
   41 |     to_state: normalizeWorkflowLifecycleState(transition.to_state, 'discovered'),
   42 |     event_type: sanitizeString(transition.event_type, 80) || 'state_transition',
   43 |     actor_id: sanitizeString(transition.actor_id, 120),
   44 |     source: sanitizeString(transition.source, 80),
   45 |     metadata: transition.metadata && typeof transition.metadata === 'object' ? transition.metadata : {},
   46 |     created_at: sanitizeString(transition.created_at, 80) || nowIso(),
   47 |     accepted: Boolean(transition.accepted),
   48 |     error_code: sanitizeString(transition.error_code, 80),
   49 |     error_message: sanitizeString(transition.error_message, 260),
   50 |   }
   51 | }
   52 | 
   53 | async function appendAuditLog(entry = {}) {
   54 |   const rows = await readLocalJson(AUDIT_FILE, [])
   55 |   const next = [...(Array.isArray(rows) ? rows : []), { id: crypto.randomUUID(), created_at: nowIso(), ...entry }]
   56 |   await writeLocalJson(AUDIT_FILE, next)
   57 | }
   58 | 
   59 | async function readJourneys() {
   60 |   if (supportsPrismaWorkflow()) {
   61 |     const rows = await prisma.workflowJourney.findMany()
   62 |     return rows.map(normalizeJourney)
   63 |   }
   64 |   const rows = await readLocalJson(JOURNEYS_FILE, [])
   65 |   return (Array.isArray(rows) ? rows : []).map(normalizeJourney)
   66 | }
   67 | 
   68 | async function writeJourneys(rows = []) {
   69 |   const safeRows = (Array.isArray(rows) ? rows : []).map(normalizeJourney)
   70 |   if (supportsPrismaWorkflow()) {
   71 |     const existing = await prisma.workflowJourney.findMany({ select: { id: true } })
   72 |     const keepIds = new Set(safeRows.map((row) => row.id))
   73 |     const deleteIds = existing.map((row) => row.id).filter((id) => !keepIds.has(id))
   74 |     if (deleteIds.length) {
   75 |       await prisma.workflowJourney.deleteMany({ where: { id: { in: deleteIds } } })
   76 |     }
   77 | 
   78 |     for (const row of safeRows) {
   79 |       await prisma.workflowJourney.upsert({
   80 |         where: { id: row.id },
   81 |         create: row,
   82 |         update: row,
   83 |       })
   84 |     }
   85 |     return safeRows
   86 |   }
   87 |   await writeLocalJson(JOURNEYS_FILE, safeRows)
   88 |   return safeRows
   89 | }
   90 | 
   91 | async function readTransitions(journeyId = '') {
   92 |   const id = sanitizeString(journeyId, 120)
   93 |   if (supportsPrismaWorkflow()) {
   94 |     const where = id ? { journey_id: id } : undefined
   95 |     const rows = await prisma.workflowTransition.findMany({ where, orderBy: { created_at: 'asc' } })
   96 |     return rows.map(normalizeTransition)
   97 |   }
   98 |   const rows = await readLocalJson(TRANSITIONS_FILE, [])
   99 |   const safe = (Array.isArray(rows) ? rows : []).map(normalizeTransition)
  100 |   return id ? safe.filter((row) => row.journey_id === id) : safe
  101 | }
  102 | 
  103 | async function appendTransition(transition) {
  104 |   const safe = normalizeTransition(transition)
  105 |   if (supportsPrismaWorkflow()) {
  106 |     await prisma.workflowTransition.create({ data: safe })
  107 |     return safe
  108 |   }
  109 |   const rows = await readLocalJson(TRANSITIONS_FILE, [])
  110 |   const next = [...(Array.isArray(rows) ? rows : []), safe]
  111 |   await writeLocalJson(TRANSITIONS_FILE, next)
  112 |   return safe
  113 | }
  114 | 
  115 | function resolveJourneyContext(journey, context = {}) {
  116 |   return {
  117 |     ...journey,
  118 |     match_id: sanitizeString(context.match_id, 120) || journey.match_id,
  119 |     requirement_id: sanitizeString(context.requirement_id, 120) || journey.requirement_id,
  120 |     product_id: sanitizeString(context.product_id, 120) || journey.product_id,
  121 |     contract_id: sanitizeString(context.contract_id, 120) || journey.contract_id,
  122 |     updated_at: nowIso(),
  123 |   }
  124 | }
  125 | 
  126 | function findJourneyByContext(rows = [], context = {}) {
  127 |   const matchId = sanitizeString(context.match_id, 120)
  128 |   const requirementId = sanitizeString(context.requirement_id, 120)
  129 |   const productId = sanitizeString(context.product_id, 120)
  130 |   const contractId = sanitizeString(context.contract_id, 120)
  131 | 
  132 |   return rows.find((row) => {
  133 |     if (matchId && row.match_id === matchId) return true
  134 |     if (contractId && row.contract_id === contractId) return true
  135 |     if (requirementId && row.requirement_id === requirementId) return true
  136 |     if (productId && row.product_id === productId) return true
  137 |     return false
  138 |   }) || null
  139 | }
  140 | 
  141 | export async function createWorkflowJourney(payload = {}) {
  142 |   const rows = await readJourneys()
  143 |   const existing = findJourneyByContext(rows, payload)
  144 |   if (existing) {
  145 |     const merged = resolveJourneyContext(existing, payload)
  146 |     await writeJourneys(rows.map((row) => (row.id === merged.id ? merged : row)))
  147 |     return merged
  148 |   }
  149 | 
  150 |   const initialState = normalizeWorkflowLifecycleState(payload.initial_state, 'discovered')
  151 |   const journey = normalizeJourney({
  152 |     id: payload.id,
  153 |     match_id: payload.match_id,
  154 |     requirement_id: payload.requirement_id,
  155 |     product_id: payload.product_id,
  156 |     contract_id: payload.contract_id,
  157 |     current_state: initialState,
  158 |   })
  159 | 
  160 |   await writeJourneys([...rows, journey])
  161 |   await appendTransition({
  162 |     journey_id: journey.id,
  163 |     from_state: initialState,
  164 |     to_state: initialState,
  165 |     event_type: 'journey_created',
  166 |     actor_id: sanitizeString(payload.actor_id, 120),
  167 |     source: sanitizeString(payload.source, 80) || 'workflow_api',
  168 |     metadata: { initial_state: initialState },
  169 |     accepted: true,
  170 |   })
  171 | 
  172 |   return journey
  173 | }
  174 | 
  175 | export async function getWorkflowJourneyById(journeyId) {
  176 |   const id = sanitizeString(journeyId, 120)
  177 |   if (!id) return null
  178 |   const rows = await readJourneys()
  179 |   const journey = rows.find((row) => row.id === id) || null
  180 |   if (!journey) return null
  181 |   const transitions = await readTransitions(journey.id)
  182 |   return { ...journey, transitions }
  183 | }
  184 | 
  185 | export async function getWorkflowJourneyByMatchId(matchId) {
  186 |   const id = sanitizeString(matchId, 120)
  187 |   if (!id) return null
  188 |   const rows = await readJourneys()
  189 |   const journey = rows.find((row) => row.match_id === id) || null
  190 |   if (!journey) return null
  191 |   const transitions = await readTransitions(journey.id)
  192 |   return { ...journey, transitions }
  193 | }
  194 | 
  195 | export async function transitionWorkflowJourney(journeyId, payload = {}) {
  196 |   const id = sanitizeString(journeyId, 120)
  197 |   if (!id) {
  198 |     return {
  199 |       ok: false,
  200 |       status: 400,
  201 |       error: {
  202 |         code: 'INVALID_JOURNEY_ID',
  203 |         message: 'journey id is required',
  204 |         allowed_next_states: [],
  205 |       },
  206 |     }
  207 |   }
  208 | 
  209 |   const toState = normalizeWorkflowLifecycleState(payload.to_state, '')
  210 |   if (!toState) {
  211 |     return {
  212 |       ok: false,
  213 |       status: 400,
  214 |       error: {
  215 |         code: 'INVALID_TO_STATE',
  216 |         message: 'to_state is required',
  217 |         allowed_next_states: [],
  218 |       },
  219 |     }
  220 |   }
  221 | 
  222 |   const rows = await readJourneys()
  223 |   const current = rows.find((row) => row.id === id)
  224 |   if (!current) {
  225 |     return {
  226 |       ok: false,
  227 |       status: 404,
  228 |       error: {
  229 |         code: 'WORKFLOW_JOURNEY_NOT_FOUND',
  230 |         message: 'Workflow journey not found',
  231 |         allowed_next_states: [],
  232 |       },
  233 |     }
  234 |   }
  235 | 
  236 |   const merged = resolveJourneyContext(current, payload.context || {})
  237 |   const validation = validateWorkflowLifecycleTransition(merged.current_state, toState)
  238 | 
  239 |   if (!validation.ok) {
  240 |     const failed = await appendTransition({
  241 |       journey_id: id,
  242 |       from_state: merged.current_state,
  243 |       to_state: toState,
  244 |       event_type: sanitizeString(payload.event_type, 80) || 'invalid_transition',
  245 |       actor_id: sanitizeString(payload.actor_id, 120),
  246 |       source: sanitizeString(payload.source, 80) || 'workflow_api',
  247 |       metadata: payload.metadata || {},
  248 |       accepted: false,
  249 |       error_code: validation.code,
  250 |       error_message: validation.message,
  251 |     })
  252 | 
  253 |     await appendAuditLog({
  254 |       action: 'workflow_transition_rejected',
  255 |       journey_id: id,
  256 |       from_state: merged.current_state,
  257 |       to_state: toState,
  258 |       error_code: validation.code,
  259 |       error_message: validation.message,
  260 |       actor_id: sanitizeString(payload.actor_id, 120),
  261 |       source: sanitizeString(payload.source, 80) || 'workflow_api',
  262 |     })
  263 | 
  264 |     return {
  265 |       ok: false,
  266 |       status: 409,
  267 |       error: {
  268 |         code: validation.code,
  269 |         message: validation.message,
  270 |         allowed_next_states: validation.allowed_next_states,
  271 |       },
  272 |       transition: failed,
  273 |     }
  274 |   }
  275 | 
  276 |   const updated = {
  277 |     ...merged,
  278 |     current_state: toState,
  279 |     updated_at: nowIso(),
  280 |   }
  281 | 
  282 |   await writeJourneys(rows.map((row) => (row.id === id ? updated : row)))
  283 | 
  284 |   const accepted = await appendTransition({
  285 |     journey_id: id,
  286 |     from_state: merged.current_state,
  287 |     to_state: toState,
  288 |     event_type: sanitizeString(payload.event_type, 80) || 'state_transition',
  289 |     actor_id: sanitizeString(payload.actor_id, 120),
  290 |     source: sanitizeString(payload.source, 80) || 'workflow_api',
  291 |     metadata: payload.metadata || {},
  292 |     accepted: true,
  293 |   })
  294 | 
  295 |   await appendAuditLog({
  296 |     action: 'workflow_transition_accepted',
  297 |     journey_id: id,
  298 |     from_state: merged.current_state,
  299 |     to_state: toState,
  300 |     actor_id: sanitizeString(payload.actor_id, 120),
  301 |     source: sanitizeString(payload.source, 80) || 'workflow_api',
  302 |   })
  303 | 
  304 |   return { ok: true, status: 200, journey: { ...updated, transitions: await readTransitions(id) }, transition: accepted }
  305 | }
  306 | 
  307 | export async function recordWorkflowEvent(eventType, context = {}, metadata = {}) {
  308 |   const safeType = sanitizeString(eventType, 80)
  309 |   if (!safeType) return null
  310 | 
  311 |   const stateByEvent = {
  312 |     search_open: 'discovered',
  313 |     match_confirmed: 'matched',
  314 |     chat_started: 'contacted',
  315 |     chat_message_sent: 'contacted',
  316 |     call_scheduled: 'meeting_scheduled',
  317 |     call_joined: 'negotiating',
  318 |     call_ended: 'negotiating',
  319 |     contract_created: 'contract_drafted',
  320 |     contract_signed: 'contract_signed',
  321 |     journey_closed: 'closed',
  322 |   }
  323 | 
  324 |   const journey = await createWorkflowJourney({ ...context, source: 'workflow_hook' })
  325 |   const targetState = stateByEvent[safeType]
  326 |   if (!targetState) return journey
  327 | 
  328 |   if (journey.current_state === targetState) return journey
  329 | 
  330 |   const fromIndex = WORKFLOW_LIFECYCLE_STATES.indexOf(journey.current_state)
  331 |   const targetIndex = WORKFLOW_LIFECYCLE_STATES.indexOf(targetState)
  332 |   if (fromIndex < 0 || targetIndex < 0) return journey
  333 | 
  334 |   let currentJourney = journey
  335 |   for (let idx = fromIndex + 1; idx <= targetIndex; idx += 1) {
  336 |     const nextState = WORKFLOW_LIFECYCLE_STATES[idx]
  337 |     const result = await transitionWorkflowJourney(currentJourney.id, {
  338 |       to_state: nextState,
  339 |       event_type: safeType,
  340 |       actor_id: sanitizeString(metadata?.actor_id || context?.actor_id, 120),
  341 |       source: 'workflow_hook',
  342 |       metadata,
  343 |       context,
  344 |     })
  345 |     if (!result?.ok) break
  346 |     currentJourney = result.journey
  347 |   }
  348 | 
  349 |   return currentJourney
  350 | }
  351 | 