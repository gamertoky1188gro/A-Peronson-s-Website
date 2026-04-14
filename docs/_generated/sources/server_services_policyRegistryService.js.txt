    1 | import crypto from 'crypto'
    2 | import prisma from '../utils/prisma.js'
    3 | 
    4 | function normalizeScopes(scopes = {}) {
    5 |   const role = Array.isArray(scopes?.role) ? scopes.role : []
    6 |   const plan = Array.isArray(scopes?.plan) ? scopes.plan : []
    7 |   const region = Array.isArray(scopes?.region) ? scopes.region : []
    8 |   return {
    9 |     role: [...new Set(role.map((v) => String(v || '').trim()).filter(Boolean))],
   10 |     plan: [...new Set(plan.map((v) => String(v || '').trim()).filter(Boolean))],
   11 |     region: [...new Set(region.map((v) => String(v || '').trim()).filter(Boolean))],
   12 |   }
   13 | }
   14 | 
   15 | export async function upsertPolicyDefinition({ code, name, description = '', actorId }) {
   16 |   const normalizedCode = String(code || '').trim().toLowerCase()
   17 |   if (!normalizedCode || !String(name || '').trim()) {
   18 |     const error = new Error('code and name are required')
   19 |     error.status = 400
   20 |     throw error
   21 |   }
   22 | 
   23 |   const existing = await prisma.policyDefinition.findUnique({ where: { code: normalizedCode } })
   24 |   if (existing) {
   25 |     return prisma.policyDefinition.update({
   26 |       where: { id: existing.id },
   27 |       data: {
   28 |         name: String(name).trim(),
   29 |         description: String(description || '').trim(),
   30 |         updated_at: new Date(),
   31 |       },
   32 |     })
   33 |   }
   34 | 
   35 |   return prisma.policyDefinition.create({
   36 |     data: {
   37 |       id: crypto.randomUUID(),
   38 |       code: normalizedCode,
   39 |       name: String(name).trim(),
   40 |       description: String(description || '').trim(),
   41 |       created_by: actorId || null,
   42 |     },
   43 |   })
   44 | }
   45 | 
   46 | export async function createPolicyVersion({ policyId, status = 'draft', effectiveFrom, effectiveTo = null, rules = {}, scopes = {}, actorId }) {
   47 |   const policy = await prisma.policyDefinition.findUnique({ where: { id: String(policyId || '') } })
   48 |   if (!policy) {
   49 |     const error = new Error('policy definition not found')
   50 |     error.status = 404
   51 |     throw error
   52 |   }
   53 | 
   54 |   const last = await prisma.policyVersion.findFirst({
   55 |     where: { policy_definition_id: policy.id },
   56 |     orderBy: { version: 'desc' },
   57 |   })
   58 | 
   59 |   const nextVersion = (last?.version || 0) + 1
   60 |   const normalizedScopes = normalizeScopes(scopes)
   61 | 
   62 |   const created = await prisma.policyVersion.create({
   63 |     data: {
   64 |       id: crypto.randomUUID(),
   65 |       policy_definition_id: policy.id,
   66 |       version: nextVersion,
   67 |       status: String(status || 'draft').toLowerCase(),
   68 |       effective_from: effectiveFrom ? new Date(effectiveFrom) : new Date(),
   69 |       effective_to: effectiveTo ? new Date(effectiveTo) : null,
   70 |       rules: rules && typeof rules === 'object' ? rules : {},
   71 |       created_by: actorId || null,
   72 |       scopes: {
   73 |         create: [
   74 |           ...normalizedScopes.role.map((value) => ({ id: crypto.randomUUID(), scope_type: 'role', scope_value: value })),
   75 |           ...normalizedScopes.plan.map((value) => ({ id: crypto.randomUUID(), scope_type: 'plan', scope_value: value })),
   76 |           ...normalizedScopes.region.map((value) => ({ id: crypto.randomUUID(), scope_type: 'region', scope_value: value })),
   77 |         ],
   78 |       },
   79 |     },
   80 |     include: { scopes: true },
   81 |   })
   82 | 
   83 |   return created
   84 | }
   85 | 
   86 | export async function listPolicyRegistry() {
   87 |   return prisma.policyDefinition.findMany({
   88 |     orderBy: { created_at: 'desc' },
   89 |     include: {
   90 |       versions: {
   91 |         orderBy: { version: 'desc' },
   92 |         include: { scopes: true },
   93 |       },
   94 |     },
   95 |   })
   96 | }
   97 | 
   98 | export async function simulatePolicy({ policyVersionId, actor = {} }) {
   99 |   const version = await prisma.policyVersion.findUnique({
  100 |     where: { id: String(policyVersionId || '') },
  101 |     include: { scopes: true, policy: true },
  102 |   })
  103 |   if (!version) {
  104 |     const error = new Error('policy version not found')
  105 |     error.status = 404
  106 |     throw error
  107 |   }
  108 | 
  109 |   const role = String(actor.role || '').toLowerCase()
  110 |   const plan = String(actor.plan || '').toLowerCase()
  111 |   const region = String(actor.region || '').toLowerCase()
  112 | 
  113 |   const roleScopes = version.scopes.filter((s) => s.scope_type === 'role').map((s) => s.scope_value.toLowerCase())
  114 |   const planScopes = version.scopes.filter((s) => s.scope_type === 'plan').map((s) => s.scope_value.toLowerCase())
  115 |   const regionScopes = version.scopes.filter((s) => s.scope_type === 'region').map((s) => s.scope_value.toLowerCase())
  116 | 
  117 |   const roleHit = roleScopes.length === 0 || roleScopes.includes(role)
  118 |   const planHit = planScopes.length === 0 || planScopes.includes(plan)
  119 |   const regionHit = regionScopes.length === 0 || regionScopes.includes(region)
  120 | 
  121 |   return {
  122 |     policy: {
  123 |       id: version.policy.id,
  124 |       code: version.policy.code,
  125 |       name: version.policy.name,
  126 |     },
  127 |     version: {
  128 |       id: version.id,
  129 |       version: version.version,
  130 |       status: version.status,
  131 |       effective_from: version.effective_from,
  132 |       effective_to: version.effective_to,
  133 |       rules: version.rules || {},
  134 |     },
  135 |     actor: { role, plan, region },
  136 |     matched: roleHit && planHit && regionHit,
  137 |     checks: {
  138 |       role: roleHit,
  139 |       plan: planHit,
  140 |       region: regionHit,
  141 |     },
  142 |   }
  143 | }
  144 | 