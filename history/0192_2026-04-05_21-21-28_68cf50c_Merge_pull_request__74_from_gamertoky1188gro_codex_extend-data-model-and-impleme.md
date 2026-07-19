## Commit Metadata

- **Hash:** 68cf50cfa6a7793c26947af9434e85a7447283c8
- **Parent:** f3948e953905d5ff656212acccd7c904c6914058 97eddbb81a832c9c7ab7280666ee837ba79cc453
- **Author:** Cyber Code Master
- **Date:** 2026-04-05 21:21:28
- **Message:** Merge pull request #74 from gamertoky1188gro/codex/extend-data-model-and-implement-authorization

## Custom Title

Merge pull request #74 from gamertoky1188gro/codex/extend-data-model-and-implement-authorization

## High-Level Summary

Merge pull request #74 from gamertoky1188gro/codex/extend-data-model-and-implement-authorization

10 files changed, 452 insertions(+), 17 deletions(-)

## File-by-File Breakdown

prisma/schema.prisma | 70 ++++++
server/controllers/analyticsController.js | 4 +
server/controllers/leadController.js | 18 +-
server/controllers/memberController.js | 16 ++
server/controllers/userController.js | 14 +-
.../authorizationService.integration.test.js | 57 +++++
server/services/authorizationService.js | 264 +++++++++++++++++++++
src/components/leads/LeadManager.jsx | 9 +-
src/pages/Insights.jsx | 9 +-
src/pages/MemberManagement.jsx | 8 +-
10 files changed, 452 insertions(+), 17 deletions(-)

## Detailed Diff Analysis

```diff
diff --git a/prisma/schema.prisma b/prisma/schema.prisma
index 00e6b3e..89bde8c 100644
--- a/prisma/schema.prisma
+++ b/prisma/schema.prisma
@@ -688,3 +688,73 @@ model AppState {

   @@map("app_state")
 }
+
+model OrgSeat {
+  id            String   @id
+  org_id        String
+  member_id     String
+  status        String   @default("active")
+  role_id       String?
+  team          String?
+  sub_team      String?
+  created_at    DateTime @default(now())
+  updated_at    DateTime?
+
+  @@unique([org_id, member_id], name: "org_id_member_id")
+  @@map("org_seats")
+}
+
+model OrgRole {
+  id          String   @id
+  org_id      String
+  code        String
+  name        String
+  description String?
+  created_at  DateTime @default(now())
+  updated_at  DateTime?
+
+  @@unique([org_id, code], name: "org_id_role_code")
+  @@map("org_roles")
+}
+
+model OrgPermission {
+  id          String   @id
+  role_id     String
+  module      String
+  action      String
+  allow       Boolean  @default(true)
+  created_at  DateTime @default(now())
+
+  @@unique([role_id, module, action], name: "role_module_action")
+  @@map("org_permissions")
+}
+
+model OrgPolicy {
+  id          String   @id
+  org_id      String
+  code        String
+  description String?
+  config      Json?
+  active      Boolean  @default(true)
+  created_at  DateTime @default(now())
+  updated_at  DateTime?
+
+  @@unique([org_id, code], name: "org_id_policy_code")
+  @@map("org_policies")
+}
+
+model OrgMembershipAudit {
+  id               String   @id
+  org_id           String
+  actor_id         String
+  member_id        String?
+  action           String
+  decision         String
+  policy_id        String?
+  reason           String?
+  resource_context Json?
+  created_at       DateTime @default(now())
+
+  @@index([org_id, created_at])
+  @@map("org_membership_audit")
+}
diff --git a/server/controllers/analyticsController.js b/server/controllers/analyticsController.js
index 4a665b0..35df8c3 100644
--- a/server/controllers/analyticsController.js
+++ b/server/controllers/analyticsController.js
@@ -4,6 +4,7 @@ import { findUserById } from '../services/userService.js'
 import { ensureEntitlement } from '../services/entitlementService.js'
 import { readJson } from '../utils/jsonStore.js'
 import { sanitizeString } from '../utils/validators.js'
+import { ACTIONS, authorize } from '../services/authorizationService.js'

 function isOwnerOrAdmin(user) {
   return ['owner', 'admin'].includes(String(user?.role || '').toLowerCase())
@@ -36,6 +37,7 @@ export async function analyticsDashboard(req, res) {
 export async function analyticsCompany(req, res) {
   try {
     const actor = req.user?.role === 'agent' ? await findUserById(req.user.id) : req.user
+    await authorize(actor, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'company' })
     const report = await getCompanyAnalytics(actor)
     return res.json(report)
   } catch (error) {
@@ -45,6 +47,7 @@ export async function analyticsCompany(req, res) {

 export async function analyticsPlatform(req, res) {
   try {
+    await authorize(req.user, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'platform' })
     const report = await getPlatformAnalytics(req.user)
     return res.json(report)
   } catch (error) {
@@ -55,6 +58,7 @@ export async function analyticsPlatform(req, res) {
 export async function analyticsPremium(req, res) {
   try {
     const actor = req.user?.role === 'agent' ? await findUserById(req.user.id) : req.user
+    await authorize(actor, ACTIONS.ANALYTICS_VIEW_AGENT, { scope: 'premium' })
     const insights = await getPremiumInsights(actor)
     return res.json(insights)
   } catch (error) {
diff --git a/server/controllers/leadController.js b/server/controllers/leadController.js
index 5ed6ae1..c1bab42 100644
--- a/server/controllers/leadController.js
+++ b/server/controllers/leadController.js
@@ -1,4 +1,6 @@
 import { addLeadNote, addLeadReminder, getLeadById, getLeadByMatch, listLeads, updateLead } from '../services/leadService.js'
+import { ACTIONS, authorize } from '../services/authorizationService.js'
+import { handleControllerError } from '../utils/permissions.js'

 export async function getLeads(req, res) {
   const items = await listLeads(req.user)
@@ -18,9 +20,19 @@ export async function getLeadForMatch(req, res) {
 }

 export async function patchLead(req, res) {
-  const updated = await updateLead(req.user, req.params.leadId, req.body || {})
-  if (!updated) return res.status(404).json({ error: 'Lead not found' })
-  return res.json(updated)
+  try {
+    const patch = req.body || {}
+    if (patch.assigned_agent_id !== undefined) {
+      await authorize(req.user, ACTIONS.LEADS_ASSIGN, { lead_id: req.params.leadId })
+    } else {
+      await authorize(req.user, ACTIONS.ANALYTICS_VIEW_AGENT, { lead_id: req.params.leadId })
+    }
+    const updated = await updateLead(req.user, req.params.leadId, patch)
+    if (!updated) return res.status(404).json({ error: 'Lead not found' })
+    return res.json(updated)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
 }

 export async function postLeadNote(req, res) {
diff --git a/server/controllers/memberController.js b/server/controllers/memberController.js
index cc8e500..10786c2 100644
--- a/server/controllers/memberController.js
+++ b/server/controllers/memberController.js
@@ -9,6 +9,7 @@ import {
 } from '../services/memberService.js'
 import { canManageMembers, deny, handleControllerError } from '../utils/permissions.js'
 import { ensureEntitlement } from '../services/entitlementService.js'
+import { ACTIONS, authorize } from '../services/authorizationService.js'

 function orgOwnerIdFromUser(user) {
   return user?.org_owner_id || user?.org_id || user?.organization_id || user?.id
@@ -21,6 +22,16 @@ function handleError(res, error) {
 export async function createOrgMember(req, res) {
   if (!canManageMembers(req.user)) return deny(res)
   try {
+    const currentMembers = await listMembers(orgOwnerIdFromUser(req.user))
+    const constraints = await getMemberConstraints(req.user)
+    const seatCap = Number(constraints?.plan === 'premium' ? constraints?.premium_member_limit : constraints?.free_member_limit)
+    const activeSeats = currentMembers.filter((m) => String(m.status || 'active') === 'active').length
+    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, {
+      org_id: orgOwnerIdFromUser(req.user),
+      active_seats: activeSeats,
+      requested_seats: 1,
+      seat_cap: seatCap,
+    })
     if (req.body?.permissions !== undefined || req.body?.permission_matrix !== undefined) {
       await ensureEntitlement(req.user, 'team_access_management', 'Premium plan required for team access management.')
     }
@@ -34,6 +45,7 @@ export async function createOrgMember(req, res) {
 export async function listOrgMembers(req, res) {
   if (!canManageMembers(req.user)) return deny(res)
   try {
+    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user) })
     const members = await listMembers(orgOwnerIdFromUser(req.user))
     const constraints = await getMemberConstraints(req.user)
     return res.json({ members, constraints })
@@ -45,6 +57,7 @@ export async function listOrgMembers(req, res) {
 export async function putOrgMember(req, res) {
   if (!canManageMembers(req.user)) return deny(res)
   try {
+    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user), member_id: req.params.memberId })
     if (req.body?.permissions !== undefined || req.body?.permission_matrix !== undefined) {
       await ensureEntitlement(req.user, 'team_access_management', 'Premium plan required for team access management.')
     }
@@ -59,6 +72,7 @@ export async function putOrgMember(req, res) {
 export async function patchMemberPermissions(req, res) {
   if (!canManageMembers(req.user)) return deny(res)
   try {
+    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user), member_id: req.params.memberId })
     await ensureEntitlement(req.user, 'team_access_management', 'Premium plan required for team access management.')
     const member = await updateMemberPermissions(
       orgOwnerIdFromUser(req.user),
@@ -76,6 +90,7 @@ export async function patchMemberPermissions(req, res) {
 export async function postMemberPasswordReset(req, res) {
   if (!canManageMembers(req.user)) return deny(res)
   try {
+    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user), member_id: req.params.memberId })
     const result = await resetMemberPassword(orgOwnerIdFromUser(req.user), req.params.memberId)
     if (!result) return res.status(404).json({ error: 'Member not found' })
     return res.json(result)
@@ -87,6 +102,7 @@ export async function postMemberPasswordReset(req, res) {
 export async function deactivateOrRemoveOrgMember(req, res) {
   if (!canManageMembers(req.user)) return deny(res)
   try {
+    await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user), member_id: req.params.memberId })
     const mode = req.query.remove === 'true' ? 'remove' : 'deactivate'
     const result = await deactivateOrRemoveMember(orgOwnerIdFromUser(req.user), req.params.memberId, mode)
     if (!result) return res.status(404).json({ error: 'Member not found' })
diff --git a/server/controllers/userController.js b/server/controllers/userController.js
index 8beb9b9..fdd2564 100644
--- a/server/controllers/userController.js
+++ b/server/controllers/userController.js
@@ -17,17 +17,27 @@ import {
 } from '../services/userService.js'
 import { getEntitlements } from '../services/entitlementService.js'
 import { ensureEntitlement } from '../services/entitlementService.js'
+import { ACTIONS, authorize, buildCapabilityPayload } from '../services/authorizationService.js'

 export async function me(req, res) {
   const user = await findUserById(req.user.id)
   if (!user) return res.status(404).json({ error: 'User not found' })
   const { password_hash: _passwordHash, ...safeUser } = user
   const entitlements = await getEntitlements(user)
-  return res.json({ ...safeUser, entitlements })
+  const capabilities = buildCapabilityPayload(user)
+  return res.json({ ...safeUser, entitlements, capabilities })
 }

 export async function updateMyProfile(req, res) {
-  const user = await updateProfile(req.user.id, req.body || {})
+  const actor = await findUserById(req.user.id)
+  if (!actor) return res.status(404).json({ error: 'User not found' })
+  const profilePatch = req.body || {}
+  const orgSettingFields = ['brand_logo_url', 'brand_cover_url', 'brand_color', 'brand_accent', 'brand_tagline', 'brand_website', 'brand_name', 'account_manager_name', 'account_manager_email', 'account_manager_phone']
+  const touchesOrgSettings = Object.keys(profilePatch).some((field) => orgSettingFields.includes(field))
+  if (touchesOrgSettings) {
+    await authorize(actor, ACTIONS.ORG_SETTINGS_MANAGE, { section: 'branding', org_id: actor.org_owner_id || actor.id })
+  }
+  const user = await updateProfile(req.user.id, profilePatch)
   if (!user) return res.status(404).json({ error: 'User not found' })
   return res.json(user)
 }
diff --git a/server/services/__tests__/authorizationService.integration.test.js b/server/services/__tests__/authorizationService.integration.test.js
new file mode 100644
index 0000000..c7cf267
--- /dev/null
+++ b/server/services/__tests__/authorizationService.integration.test.js
@@ -0,0 +1,57 @@
+import test from 'node:test'
+import assert from 'node:assert/strict'
+
+import { ACTIONS, authorize, buildCapabilityPayload } from '../authorizationService.js'
+
+function actor(overrides = {}) {
+  return {
+    id: 'u-1',
+    role: 'owner',
+    subscription_status: 'premium',
+    profile: { team: 'alpha', sub_team: 'east' },
+    ...overrides,
+  }
+}
+
+test('denies cross-role action: agent cannot assign leads', async () => {
+  const agent = actor({ id: 'agent-1', role: 'agent', org_owner_id: 'org-1' })
+  await assert.rejects(
+    () => authorize(agent, ACTIONS.LEADS_ASSIGN, { lead_id: 'lead-1' }),
+    /cannot perform leads.assign/,
+  )
+})
+
+test('denies advanced filters for free plan', async () => {
+  const freeBuyer = actor({ role: 'buyer', subscription_status: 'free' })
+  await assert.rejects(
+    () => authorize(freeBuyer, ACTIONS.FILTERS_ADVANCED_ACCESS, {}),
+    /Advanced filters require premium\/enterprise plan/,
+  )
+})
+
+test('allows enterprise member management flow under seat cap', async () => {
+  const manager = actor({ role: 'admin' })
+  const decision = await authorize(manager, ACTIONS.MEMBERS_MANAGE, {
+    org_id: 'org-1',
+    active_seats: 4,
+    requested_seats: 1,
+    seat_cap: 10,
+  })
+  assert.equal(decision.allowed, true)
+  assert.equal(decision.action, ACTIONS.MEMBERS_MANAGE)
+})
+
+test('denies team-restricted analytics outside actor team', async () => {
+  const scopedAgent = actor({ id: 'agent-7', role: 'agent', org_owner_id: 'org-7', profile: { team: 'alpha', sub_team: 'east' } })
+  await assert.rejects(
+    () => authorize(scopedAgent, ACTIONS.ANALYTICS_VIEW_AGENT, { team: 'beta', sub_team: 'west', target_agent_id: 'agent-7' }),
+    /Restricted visibility outside your team\/sub-team/,
+  )
+})
+
+test('capability payload exposes module matrix', () => {
+  const capabilities = buildCapabilityPayload(actor({ role: 'factory' }))
+  assert.equal(capabilities.leads.assign, true)
+  assert.equal(capabilities.filters.advanced_access, true)
+  assert.equal(capabilities.members.manage, true)
+})
diff --git a/server/services/authorizationService.js b/server/services/authorizationService.js
new file mode 100644
index 0000000..4dde97c
--- /dev/null
+++ b/server/services/authorizationService.js
@@ -0,0 +1,264 @@
+import { appendAuditLog } from '../utils/auditStore.js'
+import { forbiddenError, isAgent } from '../utils/permissions.js'
+
+const POLICY_IDS = {
+  BASE_ROLE_ALLOW: 'org-policy-base-role-allow',
+  LEAD_ASSIGN_MANAGER: 'org-policy-lead-assign-manager',
+  ANALYTICS_AGENT_SCOPE: 'org-policy-analytics-agent-scope',
+  CONTRACT_APPROVE: 'org-policy-contract-approve-manager',
+  FILTERS_ADVANCED_PLAN: 'org-policy-filters-advanced-plan',
+  MEMBER_MANAGEMENT: 'org-policy-member-management',
+  ORG_SETTINGS: 'org-policy-org-settings-manager',
+  SEAT_CAP: 'org-policy-seat-cap',
+  TEAM_VISIBILITY: 'org-policy-team-visibility',
+}
+
+const ACTIONS = {
+  LEADS_ASSIGN: 'leads.assign',
+  LEADS_EXPORT: 'leads.export',
+  ANALYTICS_VIEW_ORG: 'analytics.view_org',
+  ANALYTICS_VIEW_AGENT: 'analytics.view_agent',
+  CONTRACTS_APPROVE: 'contracts.approve',
+  FILTERS_ADVANCED_ACCESS: 'filters.advanced_access',
+  MEMBERS_MANAGE: 'members.manage',
+  ORG_SETTINGS_MANAGE: 'org.settings.manage',
+}
+
+const ORG_MANAGER_ROLES = new Set(['owner', 'admin', 'buying_house', 'factory'])
+const BASE_PERMISSION_MATRIX = {
+  [ACTIONS.LEADS_ASSIGN]: ['owner', 'admin', 'buying_house', 'factory'],
+  [ACTIONS.LEADS_EXPORT]: ['owner', 'admin', 'buying_house', 'factory'],
+  [ACTIONS.ANALYTICS_VIEW_ORG]: ['owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'],
+  [ACTIONS.ANALYTICS_VIEW_AGENT]: ['owner', 'admin', 'buying_house', 'factory', 'agent'],
+  [ACTIONS.CONTRACTS_APPROVE]: ['owner', 'admin', 'buying_house', 'factory'],
+  [ACTIONS.FILTERS_ADVANCED_ACCESS]: ['owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'],
+  [ACTIONS.MEMBERS_MANAGE]: ['owner', 'admin', 'buying_house', 'factory'],
+  [ACTIONS.ORG_SETTINGS_MANAGE]: ['owner', 'admin', 'buying_house', 'factory'],
+}
+const ROLE_FILTER_PRESETS = {
+  owner: 'all_access',
+  admin: 'all_access',
+  buying_house: 'demand_ops',
+  factory: 'supply_ops',
+  buyer: 'buyer_focus',
+  agent: 'team_scoped',
+}
+
+function roleOf(actor) {
+  return String(actor?.role || '').toLowerCase()
+}
+
+function actorOrgId(actor) {
+  if (!actor) return ''
+  if (isAgent(actor)) return String(actor.org_owner_id || '')
+  return String(actor.id || actor.org_owner_id || '')
+}
+
+function isPremium(actor) {
+  return String(actor?.subscription_status || '').toLowerCase() === 'premium'
+}
+
+function teamMatches(actor, resourceContext) {
+  const actorTeam = String(actor?.profile?.team || actor?.team || '')
+  const actorSubTeam = String(actor?.profile?.sub_team || actor?.sub_team || '')
+  const resourceTeam = String(resourceContext?.team || '')
+  const resourceSubTeam = String(resourceContext?.sub_team || '')
+  if (!resourceTeam) return true
+  if (!actorTeam) return false
+  if (actorTeam !== resourceTeam) return false
+  if (!resourceSubTeam) return true
+  return actorSubTeam === resourceSubTeam
+}
+
+function policyDecision({ allowed, reason, policyId, actor, action, resourceContext }) {
+  return {
+    allowed: Boolean(allowed),
+    reason: reason || (allowed ? 'authorized' : 'forbidden'),
+    policy_id: policyId,
+    action,
+    actor_id: String(actor?.id || ''),
+    resource_context: resourceContext || {},
+  }
+}
+
+async function auditDecision(decision) {
+  await appendAuditLog({
+    id: `authz:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`,
+    type: decision.allowed ? 'authorization.granted' : 'authorization.denied',
+    actor_id: decision.actor_id,
+    action: decision.action,
+    policy_id: decision.policy_id,
+    decision: decision.allowed ? 'allow' : 'deny',
+    reason: decision.reason,
+    resource_context: decision.resource_context,
+    created_at: new Date().toISOString(),
+  })
+}
+
+function checkBasePermission(actor, action, resourceContext = {}) {
+  const role = roleOf(actor)
+  const allowedRoles = BASE_PERMISSION_MATRIX[action] || []
+  if (!allowedRoles.includes(role)) {
+    return policyDecision({
+      allowed: false,
+      reason: `Role ${role || 'unknown'} cannot perform ${action}`,
+      policyId: POLICY_IDS.BASE_ROLE_ALLOW,
+      actor,
+      action,
+      resourceContext,
+    })
+  }
+
+  if (action === ACTIONS.FILTERS_ADVANCED_ACCESS && !isPremium(actor)) {
+    return policyDecision({
+      allowed: false,
+      reason: 'Advanced filters require premium/enterprise plan',
+      policyId: POLICY_IDS.FILTERS_ADVANCED_PLAN,
+      actor,
+      action,
+      resourceContext,
+    })
+  }
+
+  return policyDecision({
+    allowed: true,
+    reason: 'Role allow-list passed',
+    policyId: POLICY_IDS.BASE_ROLE_ALLOW,
+    actor,
+    action,
+    resourceContext,
+  })
+}
+
+function applyEnterprisePolicies(actor, action, resourceContext = {}, baseDecision) {
+  if (!baseDecision.allowed) return baseDecision
+
+  if (action === ACTIONS.LEADS_ASSIGN && isAgent(actor)) {
+    return policyDecision({
+      allowed: false,
+      reason: 'Agents cannot assign leads',
+      policyId: POLICY_IDS.LEAD_ASSIGN_MANAGER,
+      actor,
+      action,
+      resourceContext,
+    })
+  }
+
+  if (action === ACTIONS.ANALYTICS_VIEW_AGENT && isAgent(actor)) {
+    const targetAgentId = String(resourceContext?.target_agent_id || actor.id || '')
+    if (targetAgentId && targetAgentId !== String(actor.id || '')) {
+      return policyDecision({
+        allowed: false,
+        reason: 'Agents can only view their own analytics scope',
+        policyId: POLICY_IDS.ANALYTICS_AGENT_SCOPE,
+        actor,
+        action,
+        resourceContext,
+      })
+    }
+  }
+
+  if (action === ACTIONS.CONTRACTS_APPROVE && !ORG_MANAGER_ROLES.has(roleOf(actor))) {
+    return policyDecision({
+      allowed: false,
+      reason: 'Contract approvals require org manager role',
+      policyId: POLICY_IDS.CONTRACT_APPROVE,
+      actor,
+      action,
+      resourceContext,
+    })
+  }
+
+  if (action === ACTIONS.MEMBERS_MANAGE) {
+    const seatCap = Number(resourceContext?.seat_cap || 0)
+    const requestedSeats = Number(resourceContext?.requested_seats || 0)
+    const activeSeats = Number(resourceContext?.active_seats || 0)
+    if (seatCap > 0 && requestedSeats > 0 && activeSeats + requestedSeats > seatCap) {
+      return policyDecision({
+        allowed: false,
+        reason: `Seat cap exceeded (${activeSeats + requestedSeats}/${seatCap})`,
+        policyId: POLICY_IDS.SEAT_CAP,
+        actor,
+        action,
+        resourceContext,
+      })
+    }
+  }
+
+  if ([ACTIONS.ANALYTICS_VIEW_ORG, ACTIONS.ANALYTICS_VIEW_AGENT, ACTIONS.LEADS_ASSIGN].includes(action)) {
+    if (!teamMatches(actor, resourceContext)) {
+      return policyDecision({
+        allowed: false,
+        reason: 'Restricted visibility outside your team/sub-team',
+        policyId: POLICY_IDS.TEAM_VISIBILITY,
+        actor,
+        action,
+        resourceContext,
+      })
+    }
+  }
+
+  if (action === ACTIONS.ORG_SETTINGS_MANAGE) {
+    if (!ORG_MANAGER_ROLES.has(roleOf(actor))) {
+      return policyDecision({
+        allowed: false,
+        reason: 'Only org managers can update organization settings',
+        policyId: POLICY_IDS.ORG_SETTINGS,
+        actor,
+        action,
+        resourceContext,
+      })
+    }
+  }
+
+  return baseDecision
+}
+
+export async function authorize(actor, action, resourceContext = {}) {
+  const requestedAction = String(action || '')
+  const baseDecision = checkBasePermission(actor, requestedAction, resourceContext)
+  const decision = applyEnterprisePolicies(actor, requestedAction, resourceContext, baseDecision)
+  await auditDecision(decision)
+  if (!decision.allowed) throw forbiddenError(decision.reason)
+  return decision
+}
+
+export function buildCapabilityPayload(actor) {
+  const orgId = actorOrgId(actor)
+  const team = String(actor?.profile?.team || actor?.team || '')
+  const subTeam = String(actor?.profile?.sub_team || actor?.sub_team || '')
+  const entries = Object.values(ACTIONS).map((action) => {
+    const baseDecision = checkBasePermission(actor, action, { org_id: orgId, team, sub_team: subTeam })
+    const decision = applyEnterprisePolicies(actor, action, { org_id: orgId, team, sub_team: subTeam }, baseDecision)
+    return [action, Boolean(decision.allowed)]
+  })
+  const byAction = Object.fromEntries(entries)
+
+  return {
+    ...byAction,
+    leads: {
+      assign: Boolean(byAction[ACTIONS.LEADS_ASSIGN]),
+      export: Boolean(byAction[ACTIONS.LEADS_EXPORT]),
+    },
+    analytics: {
+      view_org: Boolean(byAction[ACTIONS.ANALYTICS_VIEW_ORG]),
+      view_agent: Boolean(byAction[ACTIONS.ANALYTICS_VIEW_AGENT]),
+    },
+    contracts: {
+      approve: Boolean(byAction[ACTIONS.CONTRACTS_APPROVE]),
+    },
+    filters: {
+      advanced_access: Boolean(byAction[ACTIONS.FILTERS_ADVANCED_ACCESS]),
+      advanced: Boolean(byAction[ACTIONS.FILTERS_ADVANCED_ACCESS]),
+      preset: ROLE_FILTER_PRESETS[roleOf(actor)] || 'basic',
+    },
+    members: {
+      manage: Boolean(byAction[ACTIONS.MEMBERS_MANAGE]),
+    },
+    org: {
+      settings_manage: Boolean(byAction[ACTIONS.ORG_SETTINGS_MANAGE]),
+    },
+  }
+}
+
+export { ACTIONS, POLICY_IDS }
diff --git a/src/components/leads/LeadManager.jsx b/src/components/leads/LeadManager.jsx
index 6ea1e29..b7c8a4c 100644
--- a/src/components/leads/LeadManager.jsx
+++ b/src/components/leads/LeadManager.jsx
@@ -1,6 +1,6 @@
 import React, { useCallback, useEffect, useMemo, useState } from 'react'
 import { useNavigate } from 'react-router-dom'
-import { apiRequest, getToken } from '../../lib/auth'
+import { apiRequest, getCurrentUser, getToken } from '../../lib/auth'

 const STATUS_OPTIONS = [
   { key: 'new', label: 'New' },
@@ -20,6 +20,7 @@ function formatDate(value) {

 export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true }) {
   const token = useMemo(() => getToken(), [])
+  const canAssignLeads = Boolean(getCurrentUser()?.capabilities?.leads?.assign)
   const navigate = useNavigate()
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
@@ -263,7 +264,7 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
                 <div className="rounded-lg bg-slate-50 p-3">
                   <p className="text-xs uppercase tracking-widest text-slate-500">Assigned agent</p>
                   <p className="mt-1 text-sm font-medium">{assignedAgent?.name || selected?.assigned_agent_id || 'Unassigned'}</p>
-                  {!allowAssign ? null : (
+                  {!allowAssign || !canAssignLeads ? null : (
                     <button
                       type="button"
                       onClick={() => updateLead({ assigned_agent_id: window.prompt('Assign to agent id (user id)', selected?.assigned_agent_id || '') || '' })}
@@ -273,6 +274,9 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
                       Assign
                     </button>
                   )}
+                  {allowAssign && !canAssignLeads ? (
+                    <p className="mt-2 text-xs text-slate-500">Lead assignment is restricted by your role policy.</p>
+                  ) : null}
                 </div>
                 <div className="rounded-lg bg-slate-50 p-3">
                   <p className="text-xs uppercase tracking-widest text-slate-500">Updated</p>
@@ -341,4 +345,3 @@ export default function LeadManager({ title = 'Leads (CRM)', allowAssign = true
   )
 }

-
diff --git a/src/pages/Insights.jsx b/src/pages/Insights.jsx
index f0c7354..7cb9176 100644
--- a/src/pages/Insights.jsx
+++ b/src/pages/Insights.jsx
@@ -38,8 +38,8 @@ export default function Insights() {
   const searchEventCount = platformAnalytics?.search_event_count ?? 0
   const searchDataReady = platformAnalytics?.search_data_ready ?? true
   const searchMinEvents = platformAnalytics?.search_min_events ?? 25
-  const searchDataSource = platformAnalytics?.search_data_source || 'search_events'
   const premiumRole = premiumInsights?.role || ''
+  const canExportAnalytics = currentUser?.capabilities?.leads?.export !== false

   useEffect(() => {
     const role = String(premiumRole || '').toLowerCase()
@@ -175,9 +175,10 @@ export default function Insights() {
                   </div>

                   <div className="mt-4 flex gap-2">
-                    <button className="px-3 py-2 rounded ring-1 ring-slate-200/70 dark:ring-slate-800">Export CSV</button>
-                    <button className="px-3 py-2 rounded ring-1 ring-slate-200/70 dark:ring-slate-800">Download PDF Report</button>
+                    <button className="px-3 py-2 rounded ring-1 ring-slate-200/70 dark:ring-slate-800 disabled:opacity-50" disabled={!canExportAnalytics}>Export CSV</button>
+                    <button className="px-3 py-2 rounded ring-1 ring-slate-200/70 dark:ring-slate-800 disabled:opacity-50" disabled={!canExportAnalytics}>Download PDF Report</button>
                   </div>
+                  {!canExportAnalytics ? <p className="mt-2 text-xs text-slate-500">Export is disabled by organization policy.</p> : null}
                 </>
               )}
             </div>
@@ -551,5 +552,3 @@ export default function Insights() {
     </div>
   )
 }
-
-
diff --git a/src/pages/MemberManagement.jsx b/src/pages/MemberManagement.jsx
index c50869e..b56b55c 100644
--- a/src/pages/MemberManagement.jsx
+++ b/src/pages/MemberManagement.jsx
@@ -36,6 +36,7 @@ function createBlankMatrix(sections = []) {
 export default function MemberManagement() {
   const sessionUser = getCurrentUser()
   const canTeamAccess = hasEntitlement(sessionUser, 'team_access_management')
+  const canManageMembers = sessionUser?.capabilities?.members?.manage !== false
   const [search, setSearch] = useState('')
   const [members, setMembers] = useState([])
   const [constraints, setConstraints] = useState({
@@ -188,15 +189,15 @@ export default function MemberManagement() {
             <h1 className="text-2xl font-bold">Member Management</h1>
             <p className="text-sm text-[#5A5A5A]">Manage sub-accounts and permissions</p>
           </div>
-          <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-md" onClick={() => setShowCreate(true)}>+ Add New Member</button>
+          <button className="px-4 py-2 bg-[#0A66C2] text-white rounded-md disabled:opacity-50" onClick={() => setShowCreate(true)} disabled={!canManageMembers}>+ Add New Member</button>
         </div>

         {!!error && <div className="mb-3 text-sm text-red-700 bg-red-50 borderless-shadow rounded p-2">{error}</div>}
         {!!success && <div className="mb-3 text-sm text-green-700 bg-green-50 borderless-shadow rounded p-2">{success}</div>}

-        {forbidden ? <AccessDeniedState message="You do not have permission to manage members for this organization." /> : null}
+        {forbidden || !canManageMembers ? <AccessDeniedState message="You do not have permission to manage members for this organization." /> : null}

-        {forbidden ? null : (
+        {forbidden || !canManageMembers ? null : (
           <div className="bg-white neo-panel cyberpunk-card rounded-xl shadow-sm borderless-shadow p-4">
             <div className="mb-4 flex items-center gap-3">
               <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members" className="px-3 py-2 borderless-shadow rounded w-64" />
@@ -415,4 +416,3 @@ function MemberEditor({ member, constraints, getConflictMessage, onSave, canTeam
     </div>
   )
 }
-
```

## Why This Change

Merge pull request #74 from gamertoky1188gro/codex/extend-data-model-and-implement-authorization

## Was It Useful

Yes — part of iterative feature development.

## Impact Analysis

- **Scope:** 10 files changed, 452 insertions(+), 17 deletions(-)
- **Risk:** Moderate

## Relationships

Commit 192 in the 0181-0220 sequence.

## Confidence Notes

Auto-generated from git history.
