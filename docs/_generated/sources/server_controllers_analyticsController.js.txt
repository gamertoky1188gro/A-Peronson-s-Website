    1 | import {
    2 |   getAnalyticsSummary,
    3 |   getCompanyAnalytics,
    4 |   getDashboardAnalytics,
    5 |   getPlatformAnalyticsAdmin,
    6 |   getPlatformAnalyticsSegment,
    7 |   getPlatformAnalyticsSummary,
    8 |   getPlatformOverview,
    9 |   getPlatformTrends,
   10 |   getPremiumInsights,
   11 | } from '../services/analyticsService.js'
   12 | import { handleControllerError } from '../utils/permissions.js'
   13 | import { findUserById } from '../services/userService.js'
   14 | import { ensureEntitlement } from '../services/entitlementService.js'
   15 | import { readJson } from '../utils/jsonStore.js'
   16 | import { sanitizeString } from '../utils/validators.js'
   17 | import { ACTIONS, authorize } from '../services/authorizationService.js'
   18 | 
   19 | function isOwnerOrAdmin(user) {
   20 |   return ['owner', 'admin'].includes(String(user?.role || '').toLowerCase())
   21 | }
   22 | 
   23 | function handleError(res, error) {
   24 |   return handleControllerError(res, error)
   25 | }
   26 | 
   27 | export async function analyticsSummary(req, res) {
   28 |   try {
   29 |     const summary = await getAnalyticsSummary(req.user)
   30 |     return res.json(summary)
   31 |   } catch (error) {
   32 |     return handleError(res, error)
   33 |   }
   34 | }
   35 | 
   36 | export async function analyticsDashboard(req, res) {
   37 |   try {
   38 |     // Agents need permission_matrix to be evaluated; token payload is minimal, so load the full user record.
   39 |     const actor = req.user?.role === 'agent' ? await findUserById(req.user.id) : req.user
   40 |     const dashboard = await getDashboardAnalytics(actor)
   41 |     return res.json(dashboard)
   42 |   } catch (error) {
   43 |     return handleError(res, error)
   44 |   }
   45 | }
   46 | 
   47 | export async function analyticsCompany(req, res) {
   48 |   try {
   49 |     const actor = req.user?.role === 'agent' ? await findUserById(req.user.id) : req.user
   50 |     await authorize(actor, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'company' })
   51 |     const report = await getCompanyAnalytics(actor)
   52 |     return res.json(report)
   53 |   } catch (error) {
   54 |     return handleError(res, error)
   55 |   }
   56 | }
   57 | 
   58 | export async function analyticsPlatformSummary(req, res) {
   59 |   try {
   60 |     await authorize(req.user, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'platform_summary' })
   61 |     const report = await getPlatformAnalyticsSummary(req.user)
   62 |     return res.json(report)
   63 |   } catch (error) {
   64 |     return handleError(res, error)
   65 |   }
   66 | }
   67 | 
   68 | export async function analyticsPlatformOverview(req, res) {
   69 |   try {
   70 |     // overview is available to all authenticated roles but must be anonymized
   71 |     const report = await getPlatformOverview(req.user)
   72 |     return res.json(report)
   73 |   } catch (error) {
   74 |     return handleError(res, error)
   75 |   }
   76 | }
   77 | 
   78 | export async function analyticsPlatformTrends(req, res) {
   79 |   try {
   80 |     const dims = String(req.query?.dimensions || '')
   81 |       .split(',')
   82 |       .map((v) => v.trim())
   83 |       .filter(Boolean)
   84 |     const report = await getPlatformTrends(req.user, { dimensions: dims })
   85 |     return res.json(report)
   86 |   } catch (error) {
   87 |     return handleError(res, error)
   88 |   }
   89 | }
   90 | 
   91 | export async function analyticsPlatformSegment(req, res) {
   92 |   try {
   93 |     await authorize(req.user, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'platform_segment' })
   94 |     const dimensions = String(req.query?.dimensions || '')
   95 |       .split(',')
   96 |       .map((value) => value.trim())
   97 |       .filter(Boolean)
   98 |     const report = await getPlatformAnalyticsSegment(req.user, { dimensions })
   99 |     return res.json(report)
  100 |   } catch (error) {
  101 |     return handleError(res, error)
  102 |   }
  103 | }
  104 | 
  105 | export async function analyticsPlatformAdmin(req, res) {
  106 |   try {
  107 |     await authorize(req.user, ACTIONS.ANALYTICS_VIEW_ORG, { scope: 'platform_admin' })
  108 |     const report = await getPlatformAnalyticsAdmin(req.user, { export: req.query?.export === 'true' })
  109 |     return res.json(report)
  110 |   } catch (error) {
  111 |     return handleError(res, error)
  112 |   }
  113 | }
  114 | 
  115 | export async function analyticsPremium(req, res) {
  116 |   try {
  117 |     const actor = req.user?.role === 'agent' ? await findUserById(req.user.id) : req.user
  118 |     await authorize(actor, ACTIONS.ANALYTICS_VIEW_AGENT, { scope: 'premium' })
  119 |     const insights = await getPremiumInsights(actor)
  120 |     return res.json(insights)
  121 |   } catch (error) {
  122 |     return handleError(res, error)
  123 |   }
  124 | }
  125 | 
  126 | export async function analyticsViewers(req, res) {
  127 |   try {
  128 |     const entity = sanitizeString(String(req.query?.entity || ''), 40).toLowerCase()
  129 |     const id = sanitizeString(String(req.query?.id || ''), 120)
  130 |     const limit = Math.min(50, Math.max(1, Number(req.query?.limit || 10)))
  131 | 
  132 |     if (!entity || !id) return res.status(400).json({ error: 'entity and id are required' })
  133 | 
  134 |     if (!isOwnerOrAdmin(req.user)) {
  135 |       await ensureEntitlement(req.user, 'advanced_analytics', 'Premium plan required for viewer analytics.')
  136 |     }
  137 | 
  138 |     const actor = req.user?.role === 'agent' ? await findUserById(req.user.id) : req.user
  139 |     const actorOrgId = actor?.role === 'agent' ? String(actor?.org_owner_id || '') : String(actor?.id || '')
  140 | 
  141 |     if (entity === 'profile') {
  142 |       if (!isOwnerOrAdmin(actor) && actorOrgId !== id) {
  143 |         return res.status(403).json({ error: 'Forbidden' })
  144 |       }
  145 | 
  146 |       const [events, users] = await Promise.all([readJson('analytics.json'), readJson('users.json')])
  147 |       const rows = Array.isArray(events) ? events : []
  148 |       const viewers = rows
  149 |         .filter((e) => e.type === 'profile_view' && String(e.entity_id || '') === id)
  150 |         .map((e) => ({ viewer_id: String(e.actor_id || ''), viewed_at: e.created_at }))
  151 |         .filter((e) => e.viewer_id && !String(e.viewer_id).startsWith('anon:'))
  152 |         .sort((a, b) => String(b.viewed_at || '').localeCompare(String(a.viewed_at || '')))
  153 | 
  154 |       const unique = new Map()
  155 |       viewers.forEach((row) => {
  156 |         if (!unique.has(row.viewer_id)) unique.set(row.viewer_id, row)
  157 |       })
  158 | 
  159 |       const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  160 |       const items = [...unique.values()].slice(0, limit).map((row) => {
  161 |         const user = usersById.get(String(row.viewer_id))
  162 |         return {
  163 |           viewer_id: row.viewer_id,
  164 |           viewed_at: row.viewed_at,
  165 |           viewer: user ? { id: user.id, name: user.name || '', role: user.role || '', verified: Boolean(user.verified) } : null,
  166 |         }
  167 |       }).filter((row) => row.viewer)
  168 | 
  169 |       return res.json({ entity, id, items })
  170 |     }
  171 | 
  172 |     if (entity === 'product') {
  173 |       const [views, products, users] = await Promise.all([
  174 |         readJson('product_views.json'),
  175 |         readJson('company_products.json'),
  176 |         readJson('users.json'),
  177 |       ])
  178 |       const product = (Array.isArray(products) ? products : []).find((p) => String(p.id) === id)
  179 |       if (!product) return res.status(404).json({ error: 'Product not found' })
  180 | 
  181 |       if (!isOwnerOrAdmin(actor) && actorOrgId !== String(product.company_id || '')) {
  182 |         return res.status(403).json({ error: 'Forbidden' })
  183 |       }
  184 | 
  185 |       const viewers = (Array.isArray(views) ? views : [])
  186 |         .filter((row) => String(row.product_id) === id)
  187 |         .sort((a, b) => String(b.viewed_at || '').localeCompare(String(a.viewed_at || '')))
  188 | 
  189 |       const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  190 |       const seen = new Set()
  191 |       const items = []
  192 |       for (const row of viewers) {
  193 |         const viewerId = String(row.user_id || '')
  194 |         if (!viewerId || seen.has(viewerId)) continue
  195 |         const user = usersById.get(viewerId)
  196 |         if (!user) continue
  197 |         seen.add(viewerId)
  198 |         items.push({
  199 |           viewer_id: viewerId,
  200 |           viewed_at: row.viewed_at,
  201 |           viewer: { id: user.id, name: user.name || '', role: user.role || '', verified: Boolean(user.verified) },
  202 |         })
  203 |         if (items.length >= limit) break
  204 |       }
  205 | 
  206 |       return res.json({ entity, id, items })
  207 |     }
  208 | 
  209 |     return res.status(400).json({ error: 'Unsupported entity type' })
  210 |   } catch (error) {
  211 |     return handleError(res, error)
  212 |   }
  213 | }
  214 | 