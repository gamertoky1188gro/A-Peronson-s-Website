    1 | import crypto from 'crypto'
    2 | import {
    3 |   DEAL_LIFECYCLE_STATES,
    4 |   normalizeDealLifecycleState,
    5 |   validateDealLifecycleTransition,
    6 | } from '../../shared/dealLifecycle.js'
    7 | import { readLocalJson, writeLocalJson } from '../utils/localStore.js'
    8 | import { sanitizeString } from '../utils/validators.js'
    9 | 
   10 | const FILE = 'deal_journeys.json'
   11 | 
   12 | function nowIso() {
   13 |   return new Date().toISOString()
   14 | }
   15 | 
   16 | function normalizeArrayIds(values = []) {
   17 |   return [...new Set((Array.isArray(values) ? values : []).map((id) => sanitizeString(id, 120)).filter(Boolean))]
   18 | }
   19 | 
   20 | function sanitizeJourney(journey = {}) {
   21 |   return {
   22 |     id: sanitizeString(journey.id, 120) || crypto.randomUUID(),
   23 |     current_state: normalizeDealLifecycleState(journey.current_state, 'discovered'),
   24 |     search_source: sanitizeString(journey.search_source, 120),
   25 |     requirement_id: sanitizeString(journey.requirement_id, 120),
   26 |     product_id: sanitizeString(journey.product_id, 120),
   27 |     chat_thread_id: sanitizeString(journey.chat_thread_id, 120),
   28 |     call_ids: normalizeArrayIds(journey.call_ids),
   29 |     contract_id: sanitizeString(journey.contract_id, 120),
   30 |     final_conversion_status: sanitizeString(journey.final_conversion_status, 80) || 'in_progress',
   31 |     interrupted: Boolean(journey.interrupted),
   32 |     interrupted_reason: sanitizeString(journey.interrupted_reason, 240),
   33 |     rollback_logs: Array.isArray(journey.rollback_logs) ? journey.rollback_logs : [],
   34 |     invalid_transitions: Array.isArray(journey.invalid_transitions) ? journey.invalid_transitions : [],
   35 |     transitions: Array.isArray(journey.transitions) ? journey.transitions : [],
   36 |     created_at: sanitizeString(journey.created_at, 80) || nowIso(),
   37 |     updated_at: sanitizeString(journey.updated_at, 80) || nowIso(),
   38 |   }
   39 | }
   40 | 
   41 | async function readJourneys() {
   42 |   const rows = await readLocalJson(FILE, [])
   43 |   return (Array.isArray(rows) ? rows : []).map(sanitizeJourney)
   44 | }
   45 | 
   46 | async function writeJourneys(rows = []) {
   47 |   return writeLocalJson(FILE, (Array.isArray(rows) ? rows : []).map(sanitizeJourney))
   48 | }
   49 | 
   50 | function findJourneyByContext(rows = [], context = {}) {
   51 |   const contextMatchId = sanitizeString(context.chat_thread_id || context.match_id, 120)
   52 |   const contextContractId = sanitizeString(context.contract_id, 120)
   53 |   const contextRequirementId = sanitizeString(context.requirement_id, 120)
   54 |   const contextProductId = sanitizeString(context.product_id, 120)
   55 | 
   56 |   return rows.find((row) => {
   57 |     if (contextMatchId && String(row.chat_thread_id || '') === contextMatchId) return true
   58 |     if (contextContractId && String(row.contract_id || '') === contextContractId) return true
   59 |     if (contextRequirementId && String(row.requirement_id || '') === contextRequirementId) return true
   60 |     if (contextProductId && String(row.product_id || '') === contextProductId) return true
   61 |     return false
   62 |   }) || null
   63 | }
   64 | 
   65 | function pushTransition(journey, toState, eventType, metadata = {}) {
   66 |   const fromState = journey.current_state
   67 |   const validation = validateDealLifecycleTransition(fromState, toState)
   68 |   const createdAt = nowIso()
   69 | 
   70 |   if (!validation.ok) {
   71 |     return {
   72 |       ...journey,
   73 |       interrupted: true,
   74 |       interrupted_reason: validation.message,
   75 |       invalid_transitions: [
   76 |         ...(journey.invalid_transitions || []),
   77 |         {
   78 |           id: crypto.randomUUID(),
   79 |           event_type: sanitizeString(eventType, 80) || 'unknown_event',
   80 |           from_state: fromState,
   81 |           to_state: toState,
   82 |           code: validation.code,
   83 |           message: validation.message,
   84 |           allowed_next_states: validation.allowed_next_states,
   85 |           metadata,
   86 |           created_at: createdAt,
   87 |         },
   88 |       ],
   89 |       updated_at: createdAt,
   90 |     }
   91 |   }
   92 | 
   93 |   return {
   94 |     ...journey,
   95 |     current_state: toState,
   96 |     interrupted: false,
   97 |     interrupted_reason: '',
   98 |     transitions: [
   99 |       ...(journey.transitions || []),
  100 |       {
  101 |         id: crypto.randomUUID(),
  102 |         event_type: sanitizeString(eventType, 80) || 'state_transition',
  103 |         from_state: fromState,
  104 |         to_state: toState,
  105 |         metadata,
  106 |         created_at: createdAt,
  107 |       },
  108 |     ],
  109 |     updated_at: createdAt,
  110 |   }
  111 | }
  112 | 
  113 | function advanceJourneyToState(journey, targetState, eventType, metadata = {}) {
  114 |   const currentIndex = DEAL_LIFECYCLE_STATES.indexOf(journey.current_state)
  115 |   const targetIndex = DEAL_LIFECYCLE_STATES.indexOf(targetState)
  116 |   if (currentIndex < 0 || targetIndex < 0) {
  117 |     return pushTransition(journey, targetState, eventType, metadata)
  118 |   }
  119 | 
  120 |   if (targetIndex <= currentIndex) return journey
  121 | 
  122 |   let next = journey
  123 |   for (let idx = currentIndex + 1; idx <= targetIndex; idx += 1) {
  124 |     const state = DEAL_LIFECYCLE_STATES[idx]
  125 |     next = pushTransition(next, state, eventType, metadata)
  126 |   }
  127 |   return next
  128 | }
  129 | 
  130 | function mergeContext(journey, context = {}) {
  131 |   return {
  132 |     ...journey,
  133 |     search_source: sanitizeString(context.search_source, 120) || journey.search_source,
  134 |     requirement_id: sanitizeString(context.requirement_id, 120) || journey.requirement_id,
  135 |     product_id: sanitizeString(context.product_id, 120) || journey.product_id,
  136 |     chat_thread_id: sanitizeString(context.chat_thread_id || context.match_id, 120) || journey.chat_thread_id,
  137 |     contract_id: sanitizeString(context.contract_id, 120) || journey.contract_id,
  138 |     call_ids: normalizeArrayIds([...(journey.call_ids || []), ...(Array.isArray(context.call_ids) ? context.call_ids : []), context.call_id]),
  139 |   }
  140 | }
  141 | 
  142 | export async function ensureDealJourney(context = {}) {
  143 |   const rows = await readJourneys()
  144 |   const existing = findJourneyByContext(rows, context)
  145 |   if (existing) {
  146 |     const updated = {
  147 |       ...mergeContext(existing, context),
  148 |       updated_at: nowIso(),
  149 |     }
  150 |     const nextRows = rows.map((row) => (row.id === updated.id ? updated : row))
  151 |     await writeJourneys(nextRows)
  152 |     return updated
  153 |   }
  154 | 
  155 |   const journey = sanitizeJourney({
  156 |     search_source: context.search_source,
  157 |     requirement_id: context.requirement_id,
  158 |     product_id: context.product_id,
  159 |     chat_thread_id: context.chat_thread_id || context.match_id,
  160 |     contract_id: context.contract_id,
  161 |     call_ids: context.call_ids || (context.call_id ? [context.call_id] : []),
  162 |     current_state: context.initial_state || 'discovered',
  163 |     transitions: [{
  164 |       id: crypto.randomUUID(),
  165 |       event_type: 'journey_initialized',
  166 |       from_state: '',
  167 |       to_state: normalizeDealLifecycleState(context.initial_state || 'discovered', 'discovered'),
  168 |       metadata: { source: sanitizeString(context.search_source, 120) || 'unknown' },
  169 |       created_at: nowIso(),
  170 |     }],
  171 |   })
  172 | 
  173 |   await writeJourneys([...rows, journey])
  174 |   return journey
  175 | }
  176 | 
  177 | export async function recordJourneyEvent(eventType, context = {}, metadata = {}) {
  178 |   const safeEventType = sanitizeString(eventType, 80)
  179 |   if (!safeEventType) return null
  180 | 
  181 |   let journey = await ensureDealJourney(context)
  182 |   journey = mergeContext(journey, context)
  183 | 
  184 |   const targetStateByEvent = {
  185 |     search_open: 'discovered',
  186 |     match_confirmed: 'matched',
  187 |     message_start: 'contacted',
  188 |     call_scheduled: 'negotiating',
  189 |     call_completed: 'sample',
  190 |     contract_draft: 'agreed',
  191 |     contract_signed: 'signed',
  192 |     deal_closed: 'closed',
  193 |   }
  194 | 
  195 |   const targetState = targetStateByEvent[safeEventType]
  196 |   if (targetState) {
  197 |     journey = advanceJourneyToState(journey, targetState, safeEventType, metadata)
  198 |   }
  199 | 
  200 |   if (safeEventType === 'conversion_closed_won') {
  201 |     journey.final_conversion_status = 'won'
  202 |     journey = advanceJourneyToState(journey, 'closed', safeEventType, metadata)
  203 |   }
  204 | 
  205 |   if (safeEventType === 'conversion_closed_lost') {
  206 |     journey.final_conversion_status = 'lost'
  207 |     journey.interrupted = true
  208 |     journey.interrupted_reason = sanitizeString(metadata?.reason, 240) || 'Closed as lost'
  209 |   }
  210 | 
  211 |   journey.updated_at = nowIso()
  212 | 
  213 |   const rows = await readJourneys()
  214 |   const nextRows = rows.map((row) => (row.id === journey.id ? journey : row))
  215 |   await writeJourneys(nextRows)
  216 |   return journey
  217 | }
  218 | 
  219 | export async function rollbackDealJourney(journeyId, toState, reason, actorId = '') {
  220 |   const id = sanitizeString(journeyId, 120)
  221 |   const rollbackState = normalizeDealLifecycleState(toState, '')
  222 |   if (!id || !rollbackState) return null
  223 | 
  224 |   const rows = await readJourneys()
  225 |   const current = rows.find((row) => String(row.id) === id)
  226 |   if (!current) return null
  227 | 
  228 |   const log = {
  229 |     id: crypto.randomUUID(),
  230 |     actor_id: sanitizeString(actorId, 120),
  231 |     from_state: current.current_state,
  232 |     to_state: rollbackState,
  233 |     reason: sanitizeString(reason, 260) || 'manual_rollback',
  234 |     created_at: nowIso(),
  235 |   }
  236 | 
  237 |   const updated = {
  238 |     ...current,
  239 |     current_state: rollbackState,
  240 |     interrupted: true,
  241 |     interrupted_reason: `Rollback requested: ${log.reason}`,
  242 |     rollback_logs: [...(current.rollback_logs || []), log],
  243 |     updated_at: nowIso(),
  244 |   }
  245 | 
  246 |   const nextRows = rows.map((row) => (row.id === id ? updated : row))
  247 |   await writeJourneys(nextRows)
  248 |   return updated
  249 | }
  250 | 
  251 | export async function getDealJourneyById(journeyId) {
  252 |   const id = sanitizeString(journeyId, 120)
  253 |   if (!id) return null
  254 |   const rows = await readJourneys()
  255 |   return rows.find((row) => String(row.id) === id) || null
  256 | }
  257 | 
  258 | export async function getDealJourneyByContext(context = {}) {
  259 |   const rows = await readJourneys()
  260 |   return findJourneyByContext(rows, context)
  261 | }
  262 | 