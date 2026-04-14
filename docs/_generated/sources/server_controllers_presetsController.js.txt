    1 | import { listPresets, createPreset, getPresetById, updatePreset, deletePreset } from '../services/presetsService.js'
    2 | import { handleControllerError, deny, isOwnerOrAdmin } from '../utils/permissions.js'
    3 | 
    4 | export async function listPresetsController(req, res) {
    5 |   try {
    6 |     const items = await listPresets(req.user)
    7 |     return res.json({ items })
    8 |   } catch (err) {
    9 |     return handleControllerError(res, err)
   10 |   }
   11 | }
   12 | 
   13 | export async function createPresetController(req, res) {
   14 |   try {
   15 |     const payload = req.body || {}
   16 |     const created = await createPreset(req.user.id, payload)
   17 |     return res.status(201).json(created)
   18 |   } catch (err) {
   19 |     return handleControllerError(res, err)
   20 |   }
   21 | }
   22 | 
   23 | export async function getPresetController(req, res) {
   24 |   try {
   25 |     const id = String(req.params.id || '')
   26 |     const preset = await getPresetById(id)
   27 |     if (!preset) return res.status(404).json({ error: 'Preset not found' })
   28 |     if (String(preset.owner_id) !== String(req.user?.id) && !preset.shared && !isOwnerOrAdmin(req.user)) return deny(res)
   29 |     return res.json(preset)
   30 |   } catch (err) {
   31 |     return handleControllerError(res, err)
   32 |   }
   33 | }
   34 | 
   35 | export async function updatePresetController(req, res) {
   36 |   try {
   37 |     const id = String(req.params.id || '')
   38 |     const patch = req.body || {}
   39 |     const updated = await updatePreset(id, patch, req.user)
   40 |     if (!updated) return res.status(404).json({ error: 'Preset not found' })
   41 |     return res.json(updated)
   42 |   } catch (err) {
   43 |     return handleControllerError(res, err)
   44 |   }
   45 | }
   46 | 
   47 | export async function deletePresetController(req, res) {
   48 |   try {
   49 |     const id = String(req.params.id || '')
   50 |     const ok = await deletePreset(id, req.user)
   51 |     if (!ok) return res.status(404).json({ error: 'Preset not found' })
   52 |     return res.json({ ok: true })
   53 |   } catch (err) {
   54 |     return handleControllerError(res, err)
   55 |   }
   56 | }
   57 | 
   58 | export default { listPresetsController, createPresetController, getPresetController, updatePresetController, deletePresetController }
   59 | 