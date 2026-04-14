    1 | import { getCertificationSummary, listCertificationsForOrg } from '../services/certificationService.js'
    2 | import { sanitizeString } from '../utils/validators.js'
    3 | 
    4 | function resolveOrgId(user) {
    5 |   if (!user) return ''
    6 |   return String(user.role || '').toLowerCase() === 'agent'
    7 |     ? String(user.org_owner_id || '')
    8 |     : String(user.id || '')
    9 | }
   10 | 
   11 | export async function getMyCertification(req, res) {
   12 |   const orgId = resolveOrgId(req.user)
   13 |   if (!orgId) return res.status(400).json({ error: 'Organization not found' })
   14 |   const summary = await getCertificationSummary(orgId)
   15 |   const items = await listCertificationsForOrg(orgId)
   16 |   return res.json({ summary, items })
   17 | }
   18 | 
   19 | export async function getOrgCertification(req, res) {
   20 |   const orgId = sanitizeString(String(req.params.orgId || ''), 120)
   21 |   if (!orgId) return res.status(400).json({ error: 'orgId is required' })
   22 |   const summary = await getCertificationSummary(orgId)
   23 |   return res.json({ summary })
   24 | }
   25 | 