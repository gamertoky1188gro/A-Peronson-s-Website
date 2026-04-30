    1 | import { addLeadNote, addLeadReminder, getLeadById, getLeadByMatch, listLeads, updateLead } from '../services/leadService.js'
    2 | import { ACTIONS, authorize } from '../services/authorizationService.js'
    3 | import { handleControllerError } from '../utils/permissions.js'
    4 | 
    5 | export async function getLeads(req, res) {
    6 |   const items = await listLeads(req.user)
    7 |   return res.json({ items })
    8 | }
    9 | 
   10 | export async function getLead(req, res) {
   11 |   const lead = await getLeadById(req.user, req.params.leadId)
   12 |   if (!lead) return res.status(404).json({ error: 'Lead not found' })
   13 |   return res.json(lead)
   14 | }
   15 | 
   16 | export async function getLeadForMatch(req, res) {
   17 |   const lead = await getLeadByMatch(req.user, req.params.matchId)
   18 |   if (!lead) return res.status(404).json({ error: 'Lead not found' })
   19 |   return res.json(lead)
   20 | }
   21 | 
   22 | export async function patchLead(req, res) {
   23 |   try {
   24 |     const patch = req.body || {}
   25 |     if (patch.assigned_agent_id !== undefined) {
   26 |       await authorize(req.user, ACTIONS.LEADS_ASSIGN, { lead_id: req.params.leadId })
   27 |     } else {
   28 |       await authorize(req.user, ACTIONS.ANALYTICS_VIEW_AGENT, { lead_id: req.params.leadId })
   29 |     }
   30 |     const updated = await updateLead(req.user, req.params.leadId, patch)
   31 |     if (!updated) return res.status(404).json({ error: 'Lead not found' })
   32 |     return res.json(updated)
   33 |   } catch (error) {
   34 |     return handleControllerError(res, error)
   35 |   }
   36 | }
   37 | 
   38 | export async function postLeadNote(req, res) {
   39 |   const row = await addLeadNote(req.user, req.params.leadId, req.body?.note)
   40 |   if (!row) return res.status(404).json({ error: 'Lead not found' })
   41 |   if (!row.note) return res.status(400).json({ error: 'note is required' })
   42 |   return res.status(201).json(row)
   43 | }
   44 | 
   45 | export async function postLeadReminder(req, res) {
   46 |   const row = await addLeadReminder(req.user, req.params.leadId, req.body || {})
   47 |   if (!row) return res.status(404).json({ error: 'Lead not found' })
   48 |   return res.status(201).json(row)
   49 | }
   50 | 