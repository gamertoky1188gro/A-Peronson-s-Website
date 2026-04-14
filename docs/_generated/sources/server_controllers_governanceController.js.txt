    1 | import {
    2 |   createPolicyVersion,
    3 |   listPolicyRegistry,
    4 |   simulatePolicy,
    5 |   upsertPolicyDefinition,
    6 | } from '../services/policyRegistryService.js'
    7 | import { computeTrustRiskSignals, recordTrustRiskEvaluation } from '../services/trustRiskScoringService.js'
    8 | import {
    9 |   applyEnforcement,
   10 |   buildMonthlyGovernanceReport,
   11 |   fileGovernanceAppeal,
   12 |   listEnforcementHistory,
   13 |   listGovernanceTemplates,
   14 |   resolveGovernanceAppeal,
   15 |   saveNotificationTemplate,
   16 | } from '../services/enforcementService.js'
   17 | import { handleControllerError } from '../utils/permissions.js'
   18 | 
   19 | export async function listGovernancePoliciesController(req, res) {
   20 |   try {
   21 |     const items = await listPolicyRegistry()
   22 |     return res.json({ items })
   23 |   } catch (error) {
   24 |     return handleControllerError(res, error)
   25 |   }
   26 | }
   27 | 
   28 | export async function upsertGovernancePolicyController(req, res) {
   29 |   try {
   30 |     const item = await upsertPolicyDefinition({ ...req.body, actorId: req.user?.id || null })
   31 |     return res.json({ item })
   32 |   } catch (error) {
   33 |     return handleControllerError(res, error)
   34 |   }
   35 | }
   36 | 
   37 | export async function createGovernancePolicyVersionController(req, res) {
   38 |   try {
   39 |     const item = await createPolicyVersion({ ...req.body, actorId: req.user?.id || null })
   40 |     return res.json({ item })
   41 |   } catch (error) {
   42 |     return handleControllerError(res, error)
   43 |   }
   44 | }
   45 | 
   46 | export async function simulateGovernancePolicyController(req, res) {
   47 |   try {
   48 |     const result = await simulatePolicy(req.body || {})
   49 |     return res.json(result)
   50 |   } catch (error) {
   51 |     return handleControllerError(res, error)
   52 |   }
   53 | }
   54 | 
   55 | export async function trustSignalsController(req, res) {
   56 |   try {
   57 |     const userId = String(req.query?.user_id || req.body?.user_id || '')
   58 |     const result = await computeTrustRiskSignals({ userId })
   59 |     return res.json(result)
   60 |   } catch (error) {
   61 |     return handleControllerError(res, error)
   62 |   }
   63 | }
   64 | 
   65 | export async function evaluateTrustController(req, res) {
   66 |   try {
   67 |     const userId = String(req.body?.user_id || '')
   68 |     const decision = req.body?.decision ? String(req.body.decision) : null
   69 |     const result = await recordTrustRiskEvaluation({ userId, decision })
   70 |     return res.json(result)
   71 |   } catch (error) {
   72 |     return handleControllerError(res, error)
   73 |   }
   74 | }
   75 | 
   76 | export async function applyGovernanceEnforcementController(req, res) {
   77 |   try {
   78 |     const result = await applyEnforcement({ ...req.body, actorId: req.user?.id || null })
   79 |     return res.json(result)
   80 |   } catch (error) {
   81 |     return handleControllerError(res, error)
   82 |   }
   83 | }
   84 | 
   85 | export async function listGovernanceEnforcementHistoryController(req, res) {
   86 |   try {
   87 |     const items = await listEnforcementHistory({ limit: Number(req.query?.limit || 100) })
   88 |     return res.json({ items })
   89 |   } catch (error) {
   90 |     return handleControllerError(res, error)
   91 |   }
   92 | }
   93 | 
   94 | export async function saveGovernanceTemplateController(req, res) {
   95 |   try {
   96 |     const item = await saveNotificationTemplate({ ...req.body, actorId: req.user?.id || null })
   97 |     return res.json({ item })
   98 |   } catch (error) {
   99 |     return handleControllerError(res, error)
  100 |   }
  101 | }
  102 | 
  103 | export async function listGovernanceTemplateController(req, res) {
  104 |   try {
  105 |     const items = await listGovernanceTemplates()
  106 |     return res.json({ items })
  107 |   } catch (error) {
  108 |     return handleControllerError(res, error)
  109 |   }
  110 | }
  111 | 
  112 | export async function fileGovernanceAppealController(req, res) {
  113 |   try {
  114 |     const item = await fileGovernanceAppeal(req.body || {})
  115 |     return res.json({ item })
  116 |   } catch (error) {
  117 |     return handleControllerError(res, error)
  118 |   }
  119 | }
  120 | 
  121 | export async function resolveGovernanceAppealController(req, res) {
  122 |   try {
  123 |     const item = await resolveGovernanceAppeal({ ...req.body, actorId: req.user?.id || null })
  124 |     return res.json({ item })
  125 |   } catch (error) {
  126 |     return handleControllerError(res, error)
  127 |   }
  128 | }
  129 | 
  130 | export async function generateGovernanceMonthlyReportController(req, res) {
  131 |   try {
  132 |     const item = await buildMonthlyGovernanceReport({ month: req.body?.month, actorId: req.user?.id || null })
  133 |     return res.json({ item })
  134 |   } catch (error) {
  135 |     return handleControllerError(res, error)
  136 |   }
  137 | }
  138 | 