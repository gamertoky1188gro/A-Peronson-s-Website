    1 | import crypto from 'crypto'
    2 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    3 | 
    4 | const KEY = 'agent_sub_ids.json'
    5 | 
    6 | export async function listAgentSubIds(actor) {
    7 |   const all = await readLocalJson(KEY, [])
    8 |   if (!actor) return []
    9 |   if (actor?.role === 'admin' || actor?.role === 'owner') return Array.isArray(all) ? all : []
   10 |   return (Array.isArray(all) ? all : []).filter((s) => String(s.owner_id) === String(actor.id))
   11 | }
   12 | 
   13 | export async function createAgentSubId(ownerId, { label = '', metadata = {} } = {}) {
   14 |   const row = {
   15 |     id: crypto.randomUUID(),
   16 |     owner_id: String(ownerId || ''),
   17 |     label: String(label || '').slice(0, 160),
   18 |     metadata: metadata || {},
   19 |     created_at: new Date().toISOString(),
   20 |   }
   21 |   await updateLocalJson(KEY, (existing = []) => {
   22 |     const arr = Array.isArray(existing) ? existing.slice() : []
   23 |     arr.push(row)
   24 |     return arr
   25 |   }, [])
   26 |   return row
   27 | }
   28 | 
   29 | export async function getAgentSubIdById(id) {
   30 |   const all = await readLocalJson(KEY, [])
   31 |   if (!Array.isArray(all)) return null
   32 |   return all.find((r) => String(r.id) === String(id)) || null
   33 | }
   34 | 
   35 | export async function deleteAgentSubId(id, actor) {
   36 |   const all = await readLocalJson(KEY, [])
   37 |   if (!Array.isArray(all)) return false
   38 |   const idx = all.findIndex((r) => String(r.id) === String(id))
   39 |   if (idx < 0) return false
   40 |   const existing = all[idx]
   41 |   if (String(existing.owner_id) !== String(actor?.id) && actor?.role !== 'admin' && actor?.role !== 'owner') {
   42 |     throw new Error('forbidden')
   43 |   }
   44 |   const next = all.filter((r) => String(r.id) !== String(id))
   45 |   await updateLocalJson(KEY, () => next, [])
   46 |   return true
   47 | }
   48 | 
   49 | export default { listAgentSubIds, createAgentSubId, getAgentSubIdById, deleteAgentSubId }
   50 | 