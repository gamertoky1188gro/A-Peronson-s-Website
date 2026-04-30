    1 | import { Router } from 'express'
    2 | import { allowRoles, requireAuth } from '../middleware/auth.js'
    3 | import { getLead, getLeadForMatch, getLeads, patchLead, postLeadNote, postLeadReminder } from '../controllers/leadController.js'
    4 | 
    5 | const router = Router()
    6 | 
    7 | // CRM tools are for organization accounts (buying house / factory) + their agents.
    8 | router.get('/', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), getLeads)
    9 | router.get('/by-match/:matchId', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), getLeadForMatch)
   10 | router.get('/:leadId', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), getLead)
   11 | router.patch('/:leadId', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), patchLead)
   12 | router.post('/:leadId/notes', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), postLeadNote)
   13 | router.post('/:leadId/reminders', requireAuth, allowRoles('owner', 'admin', 'buying_house', 'factory', 'agent'), postLeadReminder)
   14 | 
   15 | export default router
   16 | 