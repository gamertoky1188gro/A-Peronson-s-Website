    1 | import crypto from 'crypto'
    2 | import { readLocalJson, updateLocalJson } from '../utils/localStore.js'
    3 | import { sanitizeString } from '../utils/validators.js'
    4 | import { forbiddenError } from '../utils/permissions.js'
    5 | 
    6 | const KEY = 'search_presets.json'
    7 | 
    8 | export async function listPresets(actor) {
    9 |   const all = await readLocalJson(KEY, [])
   10 |   if (!actor) return []
   11 |   // Admins see all
   12 |   if (actor?.role === 'admin' || actor?.role === 'owner') return Array.isArray(all) ? all : []
   13 |   // Otherwise return owned + shared
   14 |   return (Array.isArray(all) ? all : []).filter((p) => String(p.owner_id) === String(actor.id) || p.shared === true)
   15 | }
   16 | 
   17 | export async function createPreset(ownerId, payload = {}) {
   18 |   const now = new Date().toISOString()
   19 |   const preset = {
   20 |     id: crypto.randomUUID(),
   21 |     owner_id: String(ownerId || ''),
   22 |     name: sanitizeString(String(payload.name || 'Preset'), 160),
   23 |     filters: payload.filters && typeof payload.filters === 'object' ? payload.filters : {},
   24 |     shared: Boolean(payload.shared),
   25 |     created_at: now,
   26 |     updated_at: now,
   27 |   }
   28 | 
   29 |   await updateLocalJson(KEY, (existing = []) => {
   30 |     const arr = Array.isArray(existing) ? existing.slice() : []
   31 |     arr.push(preset)
   32 |     return arr
   33 |   }, [])
   34 | 
   35 |   return preset
   36 | }
   37 | 
   38 | export async function getPresetById(id) {
   39 |   const list = await readLocalJson(KEY, [])
   40 |   if (!Array.isArray(list)) return null
   41 |   return list.find((p) => String(p.id) === String(id)) || null
   42 | }
   43 | 
   44 | export async function updatePreset(id, patch = {}, actor) {
   45 |   const list = await readLocalJson(KEY, [])
   46 |   if (!Array.isArray(list)) return null
   47 |   const idx = list.findIndex((p) => String(p.id) === String(id))
   48 |   if (idx < 0) return null
   49 |   const existing = list[idx]
   50 |   if (String(existing.owner_id) !== String(actor?.id) && actor?.role !== 'admin' && actor?.role !== 'owner') {
   51 |     throw forbiddenError('Not allowed to modify this preset')
   52 |   }
   53 | 
   54 |   const updated = {
   55 |     ...existing,
   56 |     name: patch.name !== undefined ? sanitizeString(String(patch.name || ''), 160) : existing.name,
   57 |     filters: patch.filters !== undefined && typeof patch.filters === 'object' ? patch.filters : existing.filters,
   58 |     shared: patch.shared !== undefined ? Boolean(patch.shared) : existing.shared,
   59 |     updated_at: new Date().toISOString(),
   60 |   }
   61 | 
   62 |   list[idx] = updated
   63 |   await updateLocalJson(KEY, () => list, [])
   64 |   return updated
   65 | }
   66 | 
   67 | export async function deletePreset(id, actor) {
   68 |   const list = await readLocalJson(KEY, [])
   69 |   if (!Array.isArray(list)) return false
   70 |   const idx = list.findIndex((p) => String(p.id) === String(id))
   71 |   if (idx < 0) return false
   72 |   const existing = list[idx]
   73 |   if (String(existing.owner_id) !== String(actor?.id) && actor?.role !== 'admin' && actor?.role !== 'owner') {
   74 |     throw forbiddenError('Not allowed to delete this preset')
   75 |   }
   76 | 
   77 |   const next = list.filter((p) => String(p.id) !== String(id))
   78 |   await updateLocalJson(KEY, () => next, [])
   79 |   return true
   80 | }
   81 | 
   82 | export default { listPresets, createPreset, getPresetById, updatePreset, deletePreset }
   83 | 