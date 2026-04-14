    1 | import {
    2 |   escalateOrgLead,
    3 |   getOrgPolicies,
    4 |   getOrgQueue,
    5 |   listLeadAssignmentHistory,
    6 |   rebalanceOrgQueue,
    7 |   updateOrgPolicies,
    8 | } from '../services/orgOperationsService.js'
    9 | import {
   10 |   getOpsPolicies,
   11 |   getWorkload,
   12 |   listEscalations,
   13 |   resolveEscalation,
   14 |   updateOpsPolicies,
   15 | } from '../services/enterpriseOpsService.js'
   16 | import { handleControllerError } from '../utils/permissions.js'
   17 | 
   18 | export async function getOperationsPolicies(req, res) {
   19 |   try {
   20 |     const policy = await getOpsPolicies(req.user)
   21 |     return res.json(policy)
   22 |   } catch (error) {
   23 |     return handleControllerError(res, error)
   24 |   }
   25 | }
   26 | 
   27 | export async function putOperationsPolicies(req, res) {
   28 |   try {
   29 |     const policy = await updateOpsPolicies(req.user, req.body || {})
   30 |     return res.json(policy)
   31 |   } catch (error) {
   32 |     return handleControllerError(res, error)
   33 |   }
   34 | }
   35 | 
   36 | export async function getLegacyOperationsPolicies(req, res) {
   37 |   try {
   38 |     const policy = await getOrgPolicies(req.user)
   39 |     return res.json(policy)
   40 |   } catch (error) {
   41 |     return handleControllerError(res, error)
   42 |   }
   43 | }
   44 | 
   45 | export async function putLegacyOperationsPolicies(req, res) {
   46 |   try {
   47 |     const policy = await updateOrgPolicies(req.user, req.body || {})
   48 |     return res.json(policy)
   49 |   } catch (error) {
   50 |     return handleControllerError(res, error)
   51 |   }
   52 | }
   53 | 
   54 | export async function getOperationsQueue(req, res) {
   55 |   try {
   56 |     const queue = await getOrgQueue(req.user)
   57 |     const assignments = await listLeadAssignmentHistory(req.user)
   58 |     return res.json({ ...queue, assignments })
   59 |   } catch (error) {
   60 |     return handleControllerError(res, error)
   61 |   }
   62 | }
   63 | 
   64 | export async function postOperationsRebalance(req, res) {
   65 |   try {
   66 |     const result = await rebalanceOrgQueue(req.user, req.body || {})
   67 |     return res.json(result)
   68 |   } catch (error) {
   69 |     return handleControllerError(res, error)
   70 |   }
   71 | }
   72 | 
   73 | export async function postOperationsEscalate(req, res) {
   74 |   try {
   75 |     const lead = await escalateOrgLead(req.user, req.params.leadId, req.body || {})
   76 |     if (!lead) return res.status(404).json({ error: 'Lead not found' })
   77 |     return res.json(lead)
   78 |   } catch (error) {
   79 |     return handleControllerError(res, error)
   80 |   }
   81 | }
   82 | 
   83 | export async function getOperationsEscalations(req, res) {
   84 |   try {
   85 |     const rows = await listEscalations(req.user)
   86 |     return res.json({ items: rows })
   87 |   } catch (error) {
   88 |     return handleControllerError(res, error)
   89 |   }
   90 | }
   91 | 
   92 | export async function postResolveEscalation(req, res) {
   93 |   try {
   94 |     const updated = await resolveEscalation(req.user, req.params.leadId, req.body?.resolution_note)
   95 |     if (!updated) return res.status(404).json({ error: 'Escalation not found' })
   96 |     return res.json(updated)
   97 |   } catch (error) {
   98 |     return handleControllerError(res, error)
   99 |   }
  100 | }
  101 | 
  102 | export async function getOperationsWorkload(req, res) {
  103 |   try {
  104 |     const rows = await getWorkload(req.user)
  105 |     return res.json({ items: rows })
  106 |   } catch (error) {
  107 |     return handleControllerError(res, error)
  108 |   }
  109 | }
  110 | 