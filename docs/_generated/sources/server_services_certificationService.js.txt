    1 | import { sanitizeString } from '../utils/validators.js'
    2 | import {
    3 |   getOrderCertificationSummary,
    4 |   listOrderCertifications,
    5 |   recordCertificationEvidenceFromContract,
    6 | } from './orderCertificationService.js'
    7 | 
    8 | export async function ensureCertificationForContract(contract) {
    9 |   return recordCertificationEvidenceFromContract(contract)
   10 | }
   11 | 
   12 | export async function listCertificationsForOrg(orgId) {
   13 |   const id = sanitizeString(String(orgId || ''), 120)
   14 |   if (!id) return []
   15 |   const rows = await listOrderCertifications()
   16 |   return rows.filter((row) => String(row.user_id || '') === id)
   17 | }
   18 | 
   19 | export async function getCertificationSummary(orgId) {
   20 |   const id = sanitizeString(String(orgId || ''), 120)
   21 |   if (!id) return null
   22 |   return getOrderCertificationSummary(id)
   23 | }
   24 | 