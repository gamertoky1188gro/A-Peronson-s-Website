    1 | import { readJson } from '../utils/jsonStore.js'
    2 | 
    3 | const DEFAULTS = {
    4 |   auto_reply_enabled: false,
    5 |   allow_numeric_commitments: false,
    6 |   auto_reply_rate_limit_per_hour: 20,
    7 |   ai_handoff_threshold: parseFloat(process.env.AI_HANDOFF_THRESHOLD || '0.65'),
    8 |   ai_hallucination_threshold: parseFloat(process.env.AI_HALLUCINATION_THRESHOLD || '0.7'),
    9 | }
   10 | 
   11 | export async function getOrgAiSettings(orgOwnerId = '') {
   12 |   const rows = await readJson('org_ai_settings.json')
   13 |   const found = Array.isArray(rows) ? rows.find((r) => String(r.org_owner_id || '') === String(orgOwnerId || '')) : null
   14 |   return { ...DEFAULTS, ...(found || {}) }
   15 | }
   16 | 
   17 | export default { getOrgAiSettings }
   18 | 