## Commit Metadata
- **Hash:** 6b287f29cc9662f5da7fc0752cc9126689ce3402
- **Parent:** 0f449010ca8288c87dbd7f6da63e8a7e97a9c7cb
- **Author:** gamertoky1188gro
- **Date:** 2026-04-04 21:10:48
- **Message:** Love the scope on this — we’ve now made the CRM + analytics + filter system real in the codebase.

## Custom Title
Love the scope on this — we’ve now made the CRM + analytics + filter system real in the codebase.

## High-Level Summary
Love the scope on this — we’ve now made the CRM + analytics + filter system real in the codebase.

 13 files changed, 647 insertions(+), 190 deletions(-)

## File-by-File Breakdown
commit 6b287f29cc9662f5da7fc0752cc9126689ce3402
Author: gamertoky1188gro <tokyintelligentgamer@gmail.com>
Date:   Sat Apr 4 21:10:48 2026 +0600

    Love the scope on this — we’ve now made the CRM + analytics + filter system real in the codebase.
    
    **What I implemented**
    
    **CRM**
    - Added /api/crm/profile/:targetId (team‑only) to return:
      - Recent message threads
      - Call history
      - Contract history
      - Lead status summary
    - Added **CRM Summary panel** to Buyer / Factory / Buying House profiles (shows only to org/team).
    - Conversion tracking: when a contract is signed, related leads are tagged with conversion_at.
    
    **Analytics**
    - Company analytics now include **Top Lead Sources**.
    - Platform analytics now include:
      - Top search categories (global + by country)
      - Trending search categories (30‑day delta)
    
    **Filters**
    - Added **Product vs Supplier** toggle inside advanced filters (kept tabs).
    - Organized advanced filters accordingly without changing backend query params.
    
    **Lead Tracking**
    - Leads now store source_type / source_id and fire lead_created events.
    - Contracts now trigger lead_converted events.
    
    ---
    
    **Files changed**
    - C:\Users\tokyi\OneDrive\Desktop\meow\server\services\leadService.js
    - C:\Users\tokyi\OneDrive\Desktop\meow\server\services\documentService.js
    - C:\Users\tokyi\OneDrive\Desktop\meow\server\services\crmService.js
    - C:\Users\tokyi\OneDrive\Desktop\meow\server\controllers\crmController.js
    - C:\Users\tokyi\OneDrive\Desktop\meow\server\routes\crmRoutes.js
    - C:\Users\tokyi\OneDrive\Desktop\meow\server\server.js
    - C:\Users\tokyi\OneDrive\Desktop\meow\server\services\analyticsService.js
    - C:\Users\tokyi\OneDrive\Desktop\meow\src\components\profile\CrmSummaryPanel.jsx
    - C:\Users\tokyi\OneDrive\Desktop\meow\src\pages\BuyerProfile.jsx
    - C:\Users\tokyi\OneDrive\Desktop\meow\src\pages\FactoryProfile.jsx
    - C:\Users\tokyi\OneDrive\Desktop\meow\src\pages\BuyingHouseProfile.jsx
    - C:\Users\tokyi\OneDrive\Desktop\meow\src\pages\SearchResults.jsx
    - C:\Users\tokyi\OneDrive\Desktop\meow\src\pages\Insights.jsx

 server/controllers/crmController.js        |  13 +
 server/routes/crmRoutes.js                 |   9 +
 server/server.js                           |   2 +
 server/services/analyticsService.js        |  78 +++++-
 server/services/crmService.js              | 119 +++++++++
 server/services/documentService.js         |   2 +
 server/services/leadService.js             |  44 ++++
 src/components/profile/CrmSummaryPanel.jsx | 112 ++++++++
 src/pages/BuyerProfile.jsx                 |   2 +
 src/pages/BuyingHouseProfile.jsx           |   2 +
 src/pages/FactoryProfile.jsx               |   2 +
 src/pages/Insights.jsx                     |  53 ++++
 src/pages/SearchResults.jsx                | 399 +++++++++++++++--------------
 13 files changed, 647 insertions(+), 190 deletions(-)

## Detailed Diff Analysis
```diff
diff --git a/server/controllers/crmController.js b/server/controllers/crmController.js
new file mode 100644
index 0000000..88832e2
--- /dev/null
+++ b/server/controllers/crmController.js
@@ -0,0 +1,13 @@
+import { getCrmProfileSummary } from '../services/crmService.js'
+import { handleControllerError } from '../utils/permissions.js'
+
+export async function crmProfileSummary(req, res) {
+  try {
+    const result = await getCrmProfileSummary(req.user, req.params.targetId)
+    if (result?.error === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
+    if (result?.error) return res.status(404).json({ error: result.error })
+    return res.json(result)
+  } catch (error) {
+    return handleControllerError(res, error)
+  }
+}
diff --git a/server/routes/crmRoutes.js b/server/routes/crmRoutes.js
new file mode 100644
index 0000000..0a3eb98
--- /dev/null
+++ b/server/routes/crmRoutes.js
@@ -0,0 +1,9 @@
+import { Router } from 'express'
+import { allowRoles, requireAuth } from '../middleware/auth.js'
+import { crmProfileSummary } from '../controllers/crmController.js'
+
+const router = Router()
+
+router.get('/profile/:targetId', requireAuth, allowRoles('owner', 'admin', 'buyer', 'factory', 'buying_house', 'agent'), crmProfileSummary)
+
+export default router
diff --git a/server/server.js b/server/server.js
index 62d92cd..a470764 100644
--- a/server/server.js
+++ b/server/server.js
@@ -43,6 +43,7 @@ import reportRoutes from './routes/reportRoutes.js'
 import infraRoutes from './routes/infraRoutes.js'
 import networkRoutes from './routes/networkRoutes.js'
 import certificationRoutes from './routes/certificationRoutes.js'
+import crmRoutes from './routes/crmRoutes.js'
 import { requestLogger } from './middleware/requestLogger.js'
 import { errorHandler } from './middleware/errorHandler.js'
 import { logInfo, logError } from './utils/logger.js'
@@ -118,6 +119,7 @@ app.use('/api/coupons', couponRoutes)
 app.use('/api/support', supportRoutes)
 app.use('/api/reports', reportRoutes)
 app.use('/api/certifications', certificationRoutes)
+app.use('/api/crm', crmRoutes)
 app.use('/api/infra', infraRoutes)
 app.use('/api/network', networkRoutes)
 app.use(errorHandler)
diff --git a/server/services/analyticsService.js b/server/services/analyticsService.js
index fa27b4e..592bd1a 100644
--- a/server/services/analyticsService.js
+++ b/server/services/analyticsService.js
@@ -413,13 +413,14 @@ export async function getCompanyAnalytics(user) {
   ensureAnalyticsDashboardAccess(user)
   const plan = await getPlanForUser(user)
 
-  const [events, products, productViews, messages, documents, users] = await Promise.all([
+  const [events, products, productViews, messages, documents, users, leads] = await Promise.all([
     readJson(FILE),
     readJson('company_products.json'),
     readJson('product_views.json'),
     readJson('messages.json'),
     readJson('documents.json'),
     readJson('users.json'),
+    readJson('leads.json'),
   ])
 
   const actorRole = String(user?.role || '').toLowerCase()
@@ -526,6 +527,17 @@ export async function getCompanyAnalytics(user) {
     ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
     : 0
 
+  const leadRows = (Array.isArray(leads) ? leads : []).filter((l) => String(l.org_owner_id || '') === orgOwnerId)
+  const leadSources = leadRows.reduce((acc, lead) => {
+    const label = String(lead.source_type || 'message')
+    acc[label] = (acc[label] || 0) + 1
+    return acc
+  }, {})
+  const topLeadSources = Object.entries(leadSources)
+    .sort((a, b) => b[1] - a[1])
+    .slice(0, 5)
+    .map(([label, count]) => ({ label, count }))
+
   return {
     totals: {
       profile_visits: profileEvents.length,
@@ -539,15 +551,17 @@ export async function getCompanyAnalytics(user) {
     },
     top_products: topProducts,
     profile_visits_by_country: profileVisitsByCountryList,
+    top_lead_sources: topLeadSources,
   }
 }
 
 export async function getPlatformAnalytics(user) {
   ensureAnalyticsAdminAccess(user)
 
-  const [requirements, users] = await Promise.all([
+  const [requirements, users, events] = await Promise.all([
     readJson('requirements.json'),
     readJson('users.json'),
+    readJson(FILE),
   ])
 
   const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
@@ -556,6 +570,7 @@ export async function getPlatformAnalytics(user) {
   const priceBuckets = {}
 
   const requirementsRows = Array.isArray(requirements) ? requirements : []
+  const eventRows = Array.isArray(events) ? events : []
 
   for (const req of requirementsRows) {
     const buyer = usersById.get(String(req.buyer_id || ''))
@@ -597,6 +612,49 @@ export async function getPlatformAnalytics(user) {
   const repeatBuyers = buyers.filter((bid) => buyerCounts[bid] >= 2).length
   const repeatBuyerRate = calcPercent(repeatBuyers, buyers.length)
 
+  const searchEvents = eventRows.filter((e) => String(e.type || '') === 'search_run')
+  const searchByCountry = {}
+  const searchGlobal = {}
+
+  searchEvents.forEach((event) => {
+    const country = String(event?.metadata?.country || 'Unknown')
+    const category = String(event?.metadata?.category || event?.metadata?.filters?.category || 'Other')
+    if (!searchByCountry[country]) searchByCountry[country] = {}
+    searchByCountry[country][category] = (searchByCountry[country][category] || 0) + 1
+    searchGlobal[category] = (searchGlobal[category] || 0) + 1
+  })
+
+  const topSearchCategoriesByCountry = Object.entries(searchByCountry).map(([country, categories]) => ({
+    country,
+    categories: Object.entries(categories)
+      .sort((a, b) => b[1] - a[1])
+      .slice(0, 5)
+      .map(([label, count]) => ({ label, count })),
+  }))
+
+  const topSearchCategoriesGlobal = Object.entries(searchGlobal)
+    .sort((a, b) => b[1] - a[1])
+    .slice(0, 8)
+    .map(([label, count]) => ({ label, count }))
+
+  const now = Date.now()
+  const last30 = now - 30 * 24 * 60 * 60 * 1000
+  const prev30 = now - 60 * 24 * 60 * 60 * 1000
+  const trendBuckets = { current: {}, previous: {} }
+  searchEvents.forEach((event) => {
+    const ts = new Date(event.created_at || '').getTime()
+    const category = String(event?.metadata?.category || event?.metadata?.filters?.category || 'Other')
+    if (!Number.isFinite(ts)) return
+    if (ts >= last30) trendBuckets.current[category] = (trendBuckets.current[category] || 0) + 1
+    else if (ts >= prev30) trendBuckets.previous[category] = (trendBuckets.previous[category] || 0) + 1
+  })
+
+  const trendingCategories = Object.keys(trendBuckets.current).map((cat) => {
+    const current = trendBuckets.current[cat] || 0
+    const previous = trendBuckets.previous[cat] || 0
+    return { label: cat, delta: current - previous, current, previous }
+  }).sort((a, b) => b.delta - a.delta).slice(0, 6)
+
   return {
     totals: {
       buyer_requests: requirementsRows.length,
@@ -606,6 +664,9 @@ export async function getPlatformAnalytics(user) {
     top_categories_global: topCategoriesGlobal,
     monthly_demand_trend: toMonthlySeries(requirementsRows, 'created_at'),
     price_range_demand: priceRangeDemand,
+    top_search_categories_by_country: topSearchCategoriesByCountry,
+    top_search_categories_global: topSearchCategoriesGlobal,
+    trending_search_categories: trendingCategories,
   }
 }
 
@@ -742,12 +803,25 @@ export async function getPremiumInsights(user) {
     return acc
   }, {})
 
+  const leadOutcomeByAgent = leadRows.reduce((acc, lead) => {
+    const key = String(lead.assigned_agent_id || 'unassigned')
+    if (!acc[key]) acc[key] = { closed: 0, confirmed: 0, converted: 0 }
+    const status = String(lead.status || '')
+    if (status === 'closed') acc[key].closed += 1
+    if (status === 'order_confirmed') acc[key].confirmed += 1
+    if (lead.conversion_at) acc[key].converted += 1
+    return acc
+  }, {})
+
   const agentPerformance = orgUsers
     .filter((u) => String(u.role || '').toLowerCase() === 'agent')
     .map((agent) => ({
       agent_id: agent.id,
       name: agent.name,
       assigned_leads: leadByAgent[String(agent.id)] || 0,
+      closed_leads: leadOutcomeByAgent[String(agent.id)]?.closed || 0,
+      orders_confirmed: leadOutcomeByAgent[String(agent.id)]?.confirmed || 0,
+      conversions: leadOutcomeByAgent[String(agent.id)]?.converted || 0,
     }))
 
   const categoryCounts = orgRequests.reduce((acc, r) => {
diff --git a/server/services/crmService.js b/server/services/crmService.js
new file mode 100644
index 0000000..08a69dc
--- /dev/null
+++ b/server/services/crmService.js
@@ -0,0 +1,119 @@
+import { readJson } from '../utils/jsonStore.js'
+import { sanitizeString } from '../utils/validators.js'
+import { isOwnerOrAdmin } from '../utils/permissions.js'
+
+function buildOrgMemberIds(users = [], orgId = '') {
+  const members = new Set()
+  if (!orgId) return members
+  members.add(String(orgId))
+  users.forEach((u) => {
+    if (String(u.org_owner_id || '') === String(orgId)) members.add(String(u.id))
+  })
+  return members
+}
+
+function canViewCrm(actor, targetUser) {
+  if (!actor || !targetUser) return false
+  if (isOwnerOrAdmin(actor)) return true
+  const actorId = String(actor.id || '')
+  if (actorId && actorId === String(targetUser.id || '')) return true
+  if (actor.role === 'agent' && String(actor.org_owner_id || '') === String(targetUser.id || '')) return true
+  return false
+}
+
+function compactThreadSummary(messages = []) {
+  const byMatch = new Map()
+  messages.forEach((msg) => {
+    const matchId = String(msg.match_id || '')
+    if (!matchId) return
+    if (!byMatch.has(matchId)) {
+      byMatch.set(matchId, { match_id: matchId, last_message_at: msg.timestamp || msg.created_at || '', message_count: 0 })
+    }
+    const entry = byMatch.get(matchId)
+    entry.message_count += 1
+    const ts = String(msg.timestamp || msg.created_at || '')
+    if (!entry.last_message_at || ts > entry.last_message_at) {
+      entry.last_message_at = ts
+    }
+  })
+  return [...byMatch.values()]
+    .sort((a, b) => String(b.last_message_at || '').localeCompare(String(a.last_message_at || '')))
+}
+
+export async function getCrmProfileSummary(actor, targetId) {
+  const safeTarget = sanitizeString(String(targetId || ''), 120)
+  if (!safeTarget) return { error: 'Target id required' }
+
+  const [users, messages, calls, documents, leads] = await Promise.all([
+    readJson('users.json'),
+    readJson('messages.json'),
+    readJson('call_sessions.json'),
+    readJson('documents.json'),
+    readJson('leads.json'),
+  ])
+
+  const targetUser = (Array.isArray(users) ? users : []).find((u) => String(u.id) === safeTarget) || null
+  if (!targetUser) return { error: 'Target user not found' }
+  if (!canViewCrm(actor, targetUser)) return { error: 'forbidden' }
+
+  const orgId = String(targetUser.id || '')
+  const orgMembers = buildOrgMemberIds(users, orgId)
+
+  const messageRows = (Array.isArray(messages) ? messages : []).filter((m) => {
+    const matchId = String(m.match_id || '')
+    const senderId = String(m.sender_id || '')
+    if (orgMembers.has(senderId)) return true
+    if (matchId.endsWith(`:${orgId}`)) return true
+    if (matchId.startsWith('friend:') && orgMembers.has(senderId)) return true
+    return false
+  })
+
+  const threads = compactThreadSummary(messageRows).slice(0, 8)
+
+  const callRows = (Array.isArray(calls) ? calls : []).filter((c) => {
+    const participants = Array.isArray(c.participant_ids) ? c.participant_ids.map(String) : []
+    return participants.some((id) => orgMembers.has(id))
+  })
+  const callItems = callRows
+    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
+    .slice(0, 6)
+
+  const contractRows = (Array.isArray(documents) ? documents : [])
+    .filter((d) => String(d.entity_type || '').toLowerCase() === 'contract')
+    .filter((d) => String(d.buyer_id || '') === orgId || String(d.factory_id || '') === orgId)
+  const contractItems = contractRows
+    .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))
+    .slice(0, 6)
+
+  const leadRows = (Array.isArray(leads) ? leads : [])
+    .filter((l) => String(l.org_owner_id || '') === orgId)
+    .sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
+
+  const leadStatusCounts = leadRows.reduce((acc, lead) => {
+    const key = String(lead.status || 'new')
+    acc[key] = (acc[key] || 0) + 1
+    return acc
+  }, {})
+
+  return {
+    org_id: orgId,
+    role: targetUser.role || '',
+    leads: {
+      total: leadRows.length,
+      by_status: leadStatusCounts,
+      latest: leadRows.slice(0, 6),
+    },
+    messages: {
+      total_threads: threads.length,
+      threads,
+    },
+    calls: {
+      total: callRows.length,
+      items: callItems,
+    },
+    contracts: {
+      total: contractRows.length,
+      items: contractItems,
+    },
+  }
+}
diff --git a/server/services/documentService.js b/server/services/documentService.js
index 9268f6f..170ba68 100644
--- a/server/services/documentService.js
+++ b/server/services/documentService.js
@@ -7,6 +7,7 @@ import { sanitizeString } from '../utils/validators.js'
 import { canAccessContract, canManagePartnerNetwork, canModifyContract, isAgent, isOwnerOrAdmin, scopeRecordsForUser } from '../utils/permissions.js'
 import { trackEvent } from './analyticsService.js'
 import { ensureCertificationForContract } from './certificationService.js'
+import { markLeadConvertedFromContract } from './leadService.js'
 
 const FILE = 'documents.json'
 const CONTRACT_AUDIT_FILE = 'contract_audit.json'
@@ -487,6 +488,7 @@ export async function updateContractSignatures(contractId, patch = {}, actor) {
   if (next.lifecycle_status === 'signed') {
     await trackEvent({ type: 'contract_signed', actor_id: actor.id, entity_id: next.id })
     await ensureCertificationForContract(next)
+    await markLeadConvertedFromContract({ buyerId: next.buyer_id, factoryId: next.factory_id, contractId: next.id })
   }
   return { ...presentContractForActor(next, actor), payment_proof_ok: paymentProofOk }
 }
diff --git a/server/services/leadService.js b/server/services/leadService.js
index 6272e0e..be99cf3 100644
--- a/server/services/leadService.js
+++ b/server/services/leadService.js
@@ -3,6 +3,7 @@ import { readJson, writeJson } from '../utils/jsonStore.js'
 import { sanitizeString } from '../utils/validators.js'
 import { forbiddenError, isAgent, isOwnerOrAdmin } from '../utils/permissions.js'
 import { getPlanForUser } from './entitlementService.js'
+import { trackEvent } from './analyticsService.js'
 
 const LEADS_FILE = 'leads.json'
 const NOTES_FILE = 'lead_notes.json'
@@ -122,6 +123,8 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp })
   const marketplace = friendPair ? null : parseMarketplaceMatchId(matchId)
   const buyerId = marketplace ? await resolveBuyerId(marketplace.requirementId) : ''
   const supplierId = marketplace ? marketplace.supplierId : ''
+  const leadSourceType = marketplace ? 'buyer_request' : (friendPair ? 'direct' : 'message')
+  const leadSourceId = marketplace?.requirementId || matchId || ''
 
   const orgTargets = new Map()
 
@@ -204,6 +207,8 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp })
         ...current,
         counterparty_id: current.counterparty_id || counterpartyId,
         assigned_agent_id: extras.assigned_agent_id || current.assigned_agent_id || autoAssignedAgent || '',
+        source_type: current.source_type || leadSourceType,
+        source_id: current.source_id || leadSourceId,
         last_interaction_at: interactionAt,
         updated_at: now,
       }
@@ -217,20 +222,59 @@ export async function upsertLeadFromMessage({ match_id, sender_id, timestamp })
       match_id: matchId,
       counterparty_id: counterpartyId,
       source: 'message',
+      source_type: leadSourceType,
+      source_id: leadSourceId,
       status: 'new',
       assigned_agent_id: extras.assigned_agent_id || autoAssignedAgent || '',
       created_at: now,
       updated_at: now,
       last_interaction_at: interactionAt,
+      conversion_at: '',
     }
     leads.push(row)
     updated.push(row)
+    await trackEvent({ type: 'lead_created', actor_id: senderId || orgId, entity_id: row.id, metadata: { source_type: leadSourceType, source_id: leadSourceId } })
   }
 
   await writeJson(LEADS_FILE, leads)
   return updated
 }
 
+export async function markLeadConvertedFromContract({ buyerId, factoryId, contractId }) {
+  const safeBuyer = sanitizeString(String(buyerId || ''), 120)
+  const safeFactory = sanitizeString(String(factoryId || ''), 120)
+  const safeContract = sanitizeString(String(contractId || ''), 120)
+  if (!safeBuyer || !safeFactory || !safeContract) return []
+
+  const leads = await readJson(LEADS_FILE)
+  let touched = false
+  const now = new Date().toISOString()
+  const updated = []
+
+  const next = leads.map((lead) => {
+    const orgId = String(lead.org_owner_id || '')
+    const counterparty = String(lead.counterparty_id || '')
+    const shouldMatch = (orgId === safeFactory && counterparty === safeBuyer) || (orgId === safeBuyer && counterparty === safeFactory)
+    if (!shouldMatch) return lead
+    if (lead.conversion_at) return lead
+    const row = {
+      ...lead,
+      conversion_at: now,
+      updated_at: now,
+    }
+    touched = true
+    updated.push(row)
+    return row
+  })
+
+  if (touched) {
+    await writeJson(LEADS_FILE, next)
+    await trackEvent({ type: 'lead_converted', actor_id: safeFactory || safeBuyer, entity_id: safeContract, metadata: { buyer_id: safeBuyer, factory_id: safeFactory } })
+  }
+
+  return updated
+}
+
 export async function listLeads(actor) {
   const leads = await readJson(LEADS_FILE)
   if (isOwnerOrAdmin(actor)) return leads.sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
diff --git a/src/components/profile/CrmSummaryPanel.jsx b/src/components/profile/CrmSummaryPanel.jsx
new file mode 100644
index 0000000..0cad9d6
--- /dev/null
+++ b/src/components/profile/CrmSummaryPanel.jsx
@@ -0,0 +1,112 @@
+import React, { useEffect, useMemo, useState } from 'react'
+import { apiRequest, getCurrentUser, getToken } from '../../lib/auth'
+
+function formatDate(value) {
+  if (!value) return '--'
+  const date = new Date(value)
+  if (Number.isNaN(date.getTime())) return '--'
+  return date.toLocaleString()
+}
+
+export default function CrmSummaryPanel({ targetId }) {
+  const token = useMemo(() => getToken(), [])
+  const currentUser = useMemo(() => getCurrentUser(), [])
+  const [data, setData] = useState(null)
+  const [error, setError] = useState('')
+
+  useEffect(() => {
+    if (!token || !targetId) return
+    let alive = true
+    apiRequest(`/crm/profile/${encodeURIComponent(targetId)}`, { token })
+      .then((res) => {
+        if (!alive) return
+        setData(res)
+        setError('')
+      })
+      .catch((err) => {
+        if (!alive) return
+        setError(err.status === 403 ? '' : (err.message || 'Unable to load CRM summary'))
+        setData(null)
+      })
+    return () => {
+      alive = false
+    }
+  }, [targetId, token])
+
+  if (!data && !error) return null
+  if (!data) return null
+
+  const leadStatus = data?.leads?.by_status || {}
+  const recentThreads = Array.isArray(data?.messages?.threads) ? data.messages.threads : []
+  const recentCalls = Array.isArray(data?.calls?.items) ? data.calls.items : []
+  const recentContracts = Array.isArray(data?.contracts?.items) ? data.contracts.items : []
+  const openLink = currentUser?.role === 'agent' ? '/agent?tab=leads' : '/owner?tab=leads'
+
+  return (
+    <section className="mt-6 rounded-2xl borderless-shadow bg-white p-5">
+      <div className="flex flex-wrap items-center justify-between gap-3">
+        <div>
+          <p className="text-sm font-semibold text-slate-900">CRM Summary</p>
+          <p className="text-[11px] text-slate-500">Visible only to your team</p>
+        </div>
+        <a href={openLink} className="rounded-full bg-[#0A66C2] px-3 py-1 text-[11px] font-semibold text-white">
+          Open Leads
+        </a>
+      </div>
+
+      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
+        <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
+          <p className="text-xs font-semibold text-slate-600">Lead Status</p>
+          <div className="mt-2 space-y-1 text-xs text-slate-700">
+            {Object.keys(leadStatus).length ? (
+              Object.entries(leadStatus).map(([status, count]) => (
+                <div key={status} className="flex items-center justify-between">
+                  <span className="capitalize">{String(status).replace(/_/g, ' ')}</span>
+                  <span className="font-semibold">{count}</span>
+                </div>
+              ))
+            ) : (
+              <div className="text-slate-400">No leads yet.</div>
+            )}
+          </div>
+        </div>
+
+        <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
+          <p className="text-xs font-semibold text-slate-600">Recent Messages</p>
+          <div className="mt-2 space-y-2 text-xs text-slate-700">
+            {recentThreads.length ? recentThreads.slice(0, 4).map((thread) => (
+              <div key={thread.match_id} className="flex items-center justify-between">
+                <span className="truncate">Thread {thread.match_id.slice(0, 10)}...</span>
+                <span className="text-[10px] text-slate-500">{formatDate(thread.last_message_at)}</span>
+              </div>
+            )) : <div className="text-slate-400">No messages yet.</div>}
+          </div>
+        </div>
+
+        <div className="rounded-xl borderless-shadow bg-slate-50 p-3">
+          <p className="text-xs font-semibold text-slate-600">Calls & Contracts</p>
+          <div className="mt-2 space-y-2 text-xs text-slate-700">
+            <div className="flex items-center justify-between">
+              <span>Calls</span>
+              <span className="font-semibold">{data?.calls?.total ?? 0}</span>
+            </div>
+            <div className="flex items-center justify-between">
+              <span>Contracts</span>
+              <span className="font-semibold">{data?.contracts?.total ?? 0}</span>
+            </div>
+            {recentContracts.length ? (
+              <div className="text-[10px] text-slate-500">
+                Latest contract: {formatDate(recentContracts[0]?.updated_at || recentContracts[0]?.created_at)}
+              </div>
+            ) : null}
+            {recentCalls.length ? (
+              <div className="text-[10px] text-slate-500">
+                Latest call: {formatDate(recentCalls[0]?.created_at || recentCalls[0]?.started_at)}
+              </div>
+            ) : null}
+          </div>
+        </div>
+      </div>
+    </section>
+  )
+}
diff --git a/src/pages/BuyerProfile.jsx b/src/pages/BuyerProfile.jsx
index b851569..ca10f44 100644
--- a/src/pages/BuyerProfile.jsx
+++ b/src/pages/BuyerProfile.jsx
@@ -30,6 +30,7 @@ import { motion, useReducedMotion } from 'framer-motion'
 import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
 import { trackClientEvent } from '../lib/events'
 import VerificationPanel from '../components/profile/VerificationPanel'
+import CrmSummaryPanel from '../components/profile/CrmSummaryPanel'
 
 const Motion = motion
 
@@ -312,6 +313,7 @@ export default function BuyerProfile() {
         </aside>
 
         <main className="col-span-12 lg:col-span-8 space-y-4">
+          <CrmSummaryPanel targetId={user.id} />
           <motion.div
             initial={reduceMotion ? false : { opacity: 0, y: 16 }}
             animate={reduceMotion ? false : { opacity: 1, y: 0 }}
diff --git a/src/pages/BuyingHouseProfile.jsx b/src/pages/BuyingHouseProfile.jsx
index f025fa4..42f1a1c 100644
--- a/src/pages/BuyingHouseProfile.jsx
+++ b/src/pages/BuyingHouseProfile.jsx
@@ -24,6 +24,7 @@ import { motion, useReducedMotion } from 'framer-motion'
 import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
 import { trackClientEvent } from '../lib/events'
 import VerificationPanel from '../components/profile/VerificationPanel'
+import CrmSummaryPanel from '../components/profile/CrmSummaryPanel'
 
 const Motion = motion
 
@@ -319,6 +320,7 @@ export default function BuyingHouseProfile() {
         </aside>
 
         <main className="col-span-12 lg:col-span-8 space-y-4">
+          <CrmSummaryPanel targetId={user.id} />
           <motion.div
             initial={reduceMotion ? false : { opacity: 0, y: 16 }}
             animate={reduceMotion ? false : { opacity: 1, y: 0 }}
diff --git a/src/pages/FactoryProfile.jsx b/src/pages/FactoryProfile.jsx
index 8f06b6e..3986f00 100644
--- a/src/pages/FactoryProfile.jsx
+++ b/src/pages/FactoryProfile.jsx
@@ -25,6 +25,7 @@ import { motion, useReducedMotion } from 'framer-motion'
 import { apiRequest, getCurrentUser, getToken } from '../lib/auth'
 import { trackClientEvent } from '../lib/events'
 import VerificationPanel from '../components/profile/VerificationPanel'
+import CrmSummaryPanel from '../components/profile/CrmSummaryPanel'
 
 const Motion = motion
 
@@ -282,6 +283,7 @@ export default function FactoryProfile() {
         </aside>
 
         <main className="col-span-12 lg:col-span-8 space-y-4">
+          <CrmSummaryPanel targetId={user.id} />
           <motion.div
             initial={reduceMotion ? false : { opacity: 0, y: 16 }}
             animate={reduceMotion ? false : { opacity: 1, y: 0 }}
diff --git a/src/pages/Insights.jsx b/src/pages/Insights.jsx
index fff4991..4e68aee 100644
--- a/src/pages/Insights.jsx
+++ b/src/pages/Insights.jsx
@@ -26,11 +26,15 @@ export default function Insights() {
   const companyTotals = companyAnalytics?.totals || {}
   const topProducts = Array.isArray(companyAnalytics?.top_products) ? companyAnalytics.top_products : []
   const visitCountries = Array.isArray(companyAnalytics?.profile_visits_by_country) ? companyAnalytics.profile_visits_by_country : []
+  const leadSources = Array.isArray(companyAnalytics?.top_lead_sources) ? companyAnalytics.top_lead_sources : []
   const platformTotals = platformAnalytics?.totals || {}
   const platformCategories = Array.isArray(platformAnalytics?.top_categories_global) ? platformAnalytics.top_categories_global : []
   const platformByCountry = Array.isArray(platformAnalytics?.top_categories_by_country) ? platformAnalytics.top_categories_by_country : []
   const platformPriceDemand = Array.isArray(platformAnalytics?.price_range_demand) ? platformAnalytics.price_range_demand : []
   const platformMonthly = Array.isArray(platformAnalytics?.monthly_demand_trend) ? platformAnalytics.monthly_demand_trend : []
+  const platformSearchGlobal = Array.isArray(platformAnalytics?.top_search_categories_global) ? platformAnalytics.top_search_categories_global : []
+  const platformSearchByCountry = Array.isArray(platformAnalytics?.top_search_categories_by_country) ? platformAnalytics.top_search_categories_by_country : []
+  const platformTrending = Array.isArray(platformAnalytics?.trending_search_categories) ? platformAnalytics.trending_search_categories : []
   const premiumRole = premiumInsights?.role || ''
 
   useEffect(() => {
@@ -410,6 +414,18 @@ export default function Insights() {
                     </div>
                   </div>
                 </div>
+
+                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
+                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Top Lead Sources</p>
+                  <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
+                    {leadSources.length ? leadSources.map((row) => (
+                      <div key={row.label} className="flex items-center justify-between rounded-lg borderless-shadow px-3 py-2">
+                        <span className="truncate">{row.label}</span>
+                        <span className="text-xs font-semibold">{row.count}</span>
+                      </div>
+                    )) : <div className="text-sm text-slate-500">No lead source data yet.</div>}
+                  </div>
+                </div>
               </div>
             ) : null}
 
@@ -446,6 +462,43 @@ export default function Insights() {
                   </div>
                 </div>
 
+                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
+                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
+                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Top Search Categories</p>
+                    <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
+                      {platformSearchGlobal.length ? platformSearchGlobal.map((row) => (
+                        <div key={row.label} className="flex items-center justify-between rounded-lg borderless-shadow px-3 py-2">
+                          <span className="truncate">{row.label}</span>
+                          <span className="text-xs font-semibold">{row.count}</span>
+                        </div>
+                      )) : <div className="text-sm text-slate-500">No search data yet.</div>}
+                    </div>
+                  </div>
+                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
+                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Trending Searches (30d)</p>
+                    <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
+                      {platformTrending.length ? platformTrending.map((row) => (
+                        <div key={row.label} className="flex items-center justify-between rounded-lg borderless-shadow px-3 py-2">
+                          <span className="truncate">{row.label}</span>
+                          <span className="text-xs font-semibold">{row.delta}</span>
+                        </div>
+                      )) : <div className="text-sm text-slate-500">No trend data yet.</div>}
+                    </div>
+                  </div>
+                </div>
+
+                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
+                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Search Categories by Country</p>
+                  <div className="mt-3 space-y-3 text-sm text-slate-700 dark:text-slate-300">
+                    {platformSearchByCountry.length ? platformSearchByCountry.map((row) => (
+                      <div key={row.country} className="rounded-lg borderless-shadow px-3 py-2">
+                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{row.country}</div>
+                        <div className="mt-1 text-sm">{(row.categories || []).map((c) => c.label).join(', ') || '--'}</div>
+                      </div>
+                    )) : <div className="text-sm text-slate-500">No search data yet.</div>}
+                  </div>
+                </div>
+
                 <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/60 dark:bg-slate-900/50 dark:ring-slate-800">
                   <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Monthly Demand Trend</p>
                   <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
diff --git a/src/pages/SearchResults.jsx b/src/pages/SearchResults.jsx
index 19af36a..5ead04d 100644
--- a/src/pages/SearchResults.jsx
+++ b/src/pages/SearchResults.jsx
@@ -187,6 +187,7 @@ export default function SearchResults() {
   const [category, setCategory] = useState(() => searchParams.get('category') || '')
   const [filtersOpen, setFiltersOpen] = useState(false)
   const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
+  const [filterMode, setFilterMode] = useState('product')
   const [upgradePrompt, setUpgradePrompt] = useState('')
   const [alertFeedback, setAlertFeedback] = useState('')
   const [autoSaveCandidate, setAutoSaveCandidate] = useState(null)
@@ -752,196 +753,218 @@ export default function SearchResults() {
 
                 {advancedFiltersOpen ? (
                   <div className="mt-3 grid grid-cols-1 gap-2">
-                  <input
-                    value={filters.fabricType}
-                    onChange={(e) => updateAdvancedFilter('fabricType', e.target.value)}
-                    placeholder="Fabric type (e.g. Cotton)"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <div className="grid grid-cols-2 gap-2">
-                    <input
-                      value={filters.gsmMin}
-                      onChange={(e) => updateAdvancedFilter('gsmMin', e.target.value)}
-                      placeholder="GSM min"
-                      disabled={premiumLocked}
-                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                    />
-                    <input
-                      value={filters.gsmMax}
-                      onChange={(e) => updateAdvancedFilter('gsmMax', e.target.value)}
-                      placeholder="GSM max"
-                      disabled={premiumLocked}
-                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                    />
-                  </div>
-                  <input
-                    value={filters.sizeRange}
-                    onChange={(e) => updateAdvancedFilter('sizeRange', e.target.value)}
-                    placeholder="Size range"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <input
-                    value={filters.colorPantone}
-                    onChange={(e) => updateAdvancedFilter('colorPantone', e.target.value)}
-                    placeholder="Color / Pantone"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <input
-                    value={filters.customization}
-                    onChange={(e) => updateAdvancedFilter('customization', e.target.value)}
-                    placeholder="Customization capability"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
-                    <input
-                      type="checkbox"
-                      checked={filters.sampleAvailable}
-                      onChange={(e) => updateAdvancedFilter('sampleAvailable', e.target.checked)}
-                      disabled={premiumLocked}
-                      className="h-4 w-4"
-                    />
-                    Sample available
-                  </label>
-                  <input
-                    value={filters.sampleLeadTime}
-                    onChange={(e) => updateAdvancedFilter('sampleLeadTime', e.target.value)}
-                    placeholder="Sample lead time (days)"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <input
-                    value={filters.certifications}
-                    onChange={(e) => updateAdvancedFilter('certifications', e.target.value)}
-                    placeholder="Certifications (e.g. GOTS,BSCI)"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <select
-                    value={filters.incoterms}
-                    onChange={(e) => updateAdvancedFilter('incoterms', e.target.value)}
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  >
-                    <option value="">Incoterms (Any)</option>
-                    <option value="FOB">FOB</option>
-                    <option value="CIF">CIF</option>
-                    <option value="EXW">EXW</option>
-                    <option value="DDP">DDP</option>
-                  </select>
-                  <input
-                    value={filters.paymentTerms}
-                    onChange={(e) => updateAdvancedFilter('paymentTerms', e.target.value)}
-                    placeholder="Payment terms"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <input
-                    value={filters.documentReady}
-                    onChange={(e) => updateAdvancedFilter('documentReady', e.target.value)}
-                    placeholder="Document readiness"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <input
-                    value={filters.auditDate}
-                    onChange={(e) => updateAdvancedFilter('auditDate', e.target.value)}
-                    placeholder="Audit date"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <input
-                    value={filters.languageSupport}
-                    onChange={(e) => updateAdvancedFilter('languageSupport', e.target.value)}
-                    placeholder="Language support"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <input
-                    value={filters.capacityMin}
-                    onChange={(e) => updateAdvancedFilter('capacityMin', e.target.value)}
-                    placeholder="Min capacity / month"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
+                    <div className="flex flex-wrap gap-2 rounded-full bg-slate-50 p-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">
+                      <button
+                        type="button"
+                        onClick={() => setFilterMode('product')}
+                        className={`rounded-full px-3 py-1 ${filterMode === 'product' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
+                      >
+                        Product Filters
+                      </button>
+                      <button
+                        type="button"
+                        onClick={() => setFilterMode('supplier')}
+                        className={`rounded-full px-3 py-1 ${filterMode === 'supplier' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-70'}`}
+                      >
+                        Supplier Filters
+                      </button>
+                    </div>
 
-                  <div className="pt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Supplier & account</div>
-                  <input
-                    value={filters.processes}
-                    onChange={(e) => updateAdvancedFilter('processes', e.target.value)}
-                    placeholder="Main processes (e.g. knit, woven)"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                  <div className="grid grid-cols-2 gap-2">
-                    <input
-                      value={filters.yearsInBusinessMin}
-                      onChange={(e) => updateAdvancedFilter('yearsInBusinessMin', e.target.value)}
-                      placeholder="Years in business (min)"
-                      disabled={premiumLocked}
-                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                    />
-                    <input
-                      value={filters.responseTimeMax}
-                      onChange={(e) => updateAdvancedFilter('responseTimeMax', e.target.value)}
-                      placeholder="Response time max (hours)"
-                      disabled={premiumLocked}
-                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                    />
-                  </div>
-                  <div className="grid grid-cols-2 gap-2">
-                    <input
-                      value={filters.teamSeatsMin}
-                      onChange={(e) => updateAdvancedFilter('teamSeatsMin', e.target.value)}
-                      placeholder="Team seats (min)"
-                      disabled={premiumLocked}
-                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                    />
-                    <input
-                      value={filters.exportPort}
-                      onChange={(e) => updateAdvancedFilter('exportPort', e.target.value)}
-                      placeholder="Export ports (comma-separated)"
-                      disabled={premiumLocked}
-                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                    />
-                  </div>
-                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
-                    <input
-                      type="checkbox"
-                      checked={filters.handlesMultipleFactories}
-                      onChange={(e) => updateAdvancedFilter('handlesMultipleFactories', e.target.checked)}
-                      disabled={premiumLocked}
-                      className="h-4 w-4"
-                    />
-                    Handles multiple factories
-                  </label>
-                  <div className="grid grid-cols-2 gap-2">
-                    <input
-                      value={filters.locationLat}
-                      onChange={(e) => updateAdvancedFilter('locationLat', e.target.value)}
-                      placeholder="Location latitude"
-                      disabled={premiumLocked}
-                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                    />
-                    <input
-                      value={filters.locationLng}
-                      onChange={(e) => updateAdvancedFilter('locationLng', e.target.value)}
-                      placeholder="Location longitude"
-                      disabled={premiumLocked}
-                      className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                    />
+                    {filterMode === 'product' ? (
+                      <>
+                        <input
+                          value={filters.fabricType}
+                          onChange={(e) => updateAdvancedFilter('fabricType', e.target.value)}
+                          placeholder="Fabric type (e.g. Cotton)"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <div className="grid grid-cols-2 gap-2">
+                          <input
+                            value={filters.gsmMin}
+                            onChange={(e) => updateAdvancedFilter('gsmMin', e.target.value)}
+                            placeholder="GSM min"
+                            disabled={premiumLocked}
+                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                          />
+                          <input
+                            value={filters.gsmMax}
+                            onChange={(e) => updateAdvancedFilter('gsmMax', e.target.value)}
+                            placeholder="GSM max"
+                            disabled={premiumLocked}
+                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                          />
+                        </div>
+                        <input
+                          value={filters.sizeRange}
+                          onChange={(e) => updateAdvancedFilter('sizeRange', e.target.value)}
+                          placeholder="Size range"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <input
+                          value={filters.colorPantone}
+                          onChange={(e) => updateAdvancedFilter('colorPantone', e.target.value)}
+                          placeholder="Color / Pantone"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <input
+                          value={filters.customization}
+                          onChange={(e) => updateAdvancedFilter('customization', e.target.value)}
+                          placeholder="Customization capability"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
+                          <input
+                            type="checkbox"
+                            checked={filters.sampleAvailable}
+                            onChange={(e) => updateAdvancedFilter('sampleAvailable', e.target.checked)}
+                            disabled={premiumLocked}
+                            className="h-4 w-4"
+                          />
+                          Sample available
+                        </label>
+                        <input
+                          value={filters.sampleLeadTime}
+                          onChange={(e) => updateAdvancedFilter('sampleLeadTime', e.target.value)}
+                          placeholder="Sample lead time (days)"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <input
+                          value={filters.certifications}
+                          onChange={(e) => updateAdvancedFilter('certifications', e.target.value)}
+                          placeholder="Certifications (e.g. GOTS,BSCI)"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <select
+                          value={filters.incoterms}
+                          onChange={(e) => updateAdvancedFilter('incoterms', e.target.value)}
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        >
+                          <option value="">Incoterms (Any)</option>
+                          <option value="FOB">FOB</option>
+                          <option value="CIF">CIF</option>
+                          <option value="EXW">EXW</option>
+                          <option value="DDP">DDP</option>
+                        </select>
+                      </>
+                    ) : (
+                      <>
+                        <input
+                          value={filters.paymentTerms}
+                          onChange={(e) => updateAdvancedFilter('paymentTerms', e.target.value)}
+                          placeholder="Payment terms"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <input
+                          value={filters.documentReady}
+                          onChange={(e) => updateAdvancedFilter('documentReady', e.target.value)}
+                          placeholder="Document readiness"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <input
+                          value={filters.auditDate}
+                          onChange={(e) => updateAdvancedFilter('auditDate', e.target.value)}
+                          placeholder="Audit date"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <input
+                          value={filters.languageSupport}
+                          onChange={(e) => updateAdvancedFilter('languageSupport', e.target.value)}
+                          placeholder="Language support"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <input
+                          value={filters.capacityMin}
+                          onChange={(e) => updateAdvancedFilter('capacityMin', e.target.value)}
+                          placeholder="Min capacity / month"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <input
+                          value={filters.processes}
+                          onChange={(e) => updateAdvancedFilter('processes', e.target.value)}
+                          placeholder="Main processes (e.g. knit, woven)"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                        <div className="grid grid-cols-2 gap-2">
+                          <input
+                            value={filters.yearsInBusinessMin}
+                            onChange={(e) => updateAdvancedFilter('yearsInBusinessMin', e.target.value)}
+                            placeholder="Years in business (min)"
+                            disabled={premiumLocked}
+                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                          />
+                          <input
+                            value={filters.responseTimeMax}
+                            onChange={(e) => updateAdvancedFilter('responseTimeMax', e.target.value)}
+                            placeholder="Response time max (hours)"
+                            disabled={premiumLocked}
+                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                          />
+                        </div>
+                        <div className="grid grid-cols-2 gap-2">
+                          <input
+                            value={filters.teamSeatsMin}
+                            onChange={(e) => updateAdvancedFilter('teamSeatsMin', e.target.value)}
+                            placeholder="Team seats (min)"
+                            disabled={premiumLocked}
+                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                          />
+                          <input
+                            value={filters.exportPort}
+                            onChange={(e) => updateAdvancedFilter('exportPort', e.target.value)}
+                            placeholder="Export ports (comma-separated)"
+                            disabled={premiumLocked}
+                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                          />
+                        </div>
+                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
+                          <input
+                            type="checkbox"
+                            checked={filters.handlesMultipleFactories}
+                            onChange={(e) => updateAdvancedFilter('handlesMultipleFactories', e.target.checked)}
+                            disabled={premiumLocked}
+                            className="h-4 w-4"
+                          />
+                          Handles multiple factories
+                        </label>
+                        <div className="grid grid-cols-2 gap-2">
+                          <input
+                            value={filters.locationLat}
+                            onChange={(e) => updateAdvancedFilter('locationLat', e.target.value)}
+                            placeholder="Location latitude"
+                            disabled={premiumLocked}
+                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                          />
+                          <input
+                            value={filters.locationLng}
+                            onChange={(e) => updateAdvancedFilter('locationLng', e.target.value)}
+                            placeholder="Location longitude"
+                            disabled={premiumLocked}
+                            className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                          />
+                        </div>
+                        <input
+                          value={filters.distanceKm}
+                          onChange={(e) => updateAdvancedFilter('distanceKm', e.target.value)}
+                          placeholder="Distance radius (km)"
+                          disabled={premiumLocked}
+                          className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
+                        />
+                      </>
+                    )}
                   </div>
-                  <input
-                    value={filters.distanceKm}
-                    onChange={(e) => updateAdvancedFilter('distanceKm', e.target.value)}
-                    placeholder="Distance radius (km)"
-                    disabled={premiumLocked}
-                    className="rounded-xl bg-white px-3 py-2 text-sm text-slate-800 ring-1 ring-slate-200/70 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(10,102,194,0.35)] dark:bg-white/5 dark:text-slate-100 dark:ring-white/10"
-                  />
-                </div>
                 ) : (
                   <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">Advanced filters are hidden to keep search simple. Use "More filters" when needed.</p>
                 )}
```

## Why This Change
Love the scope on this — we’ve now made the CRM + analytics + filter system real in the codebase.

## Was It Useful
Yes — part of iterative feature development.

## Impact Analysis
- **Scope:**  13 files changed, 647 insertions(+), 190 deletions(-)
- **Risk:** Moderate

## Relationships
Commit 181 in the 0181-0220 sequence.

## Confidence Notes
Auto-generated from git history.
