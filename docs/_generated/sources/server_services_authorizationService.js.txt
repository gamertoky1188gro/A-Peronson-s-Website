    1 | import { appendAuditLog } from '../utils/auditStore.js'
    2 | import { forbiddenError, isAgent } from '../utils/permissions.js'
    3 | 
    4 | const POLICY_IDS = {
    5 |   BASE_ROLE_ALLOW: 'org-policy-base-role-allow',
    6 |   LEAD_ASSIGN_MANAGER: 'org-policy-lead-assign-manager',
    7 |   ANALYTICS_AGENT_SCOPE: 'org-policy-analytics-agent-scope',
    8 |   CONTRACT_APPROVE: 'org-policy-contract-approve-manager',
    9 |   FILTERS_ADVANCED_PLAN: 'org-policy-filters-advanced-plan',
   10 |   MEMBER_MANAGEMENT: 'org-policy-member-management',
   11 |   ORG_SETTINGS: 'org-policy-org-settings-manager',
   12 |   SEAT_CAP: 'org-policy-seat-cap',
   13 |   TEAM_VISIBILITY: 'org-policy-team-visibility',
   14 | }
   15 | 
   16 | const ACTIONS = {
   17 |   LEADS_ASSIGN: 'leads.assign',
   18 |   LEADS_EXPORT: 'leads.export',
   19 |   ANALYTICS_VIEW_ORG: 'analytics.view_org',
   20 |   ANALYTICS_VIEW_AGENT: 'analytics.view_agent',
   21 |   CONTRACTS_APPROVE: 'contracts.approve',
   22 |   FILTERS_ADVANCED_ACCESS: 'filters.advanced_access',
   23 |   MEMBERS_MANAGE: 'members.manage',
   24 |   ORG_SETTINGS_MANAGE: 'org.settings.manage',
   25 | }
   26 | 
   27 | const ORG_MANAGER_ROLES = new Set(['owner', 'admin', 'buying_house', 'factory'])
   28 | const BASE_PERMISSION_MATRIX = {
   29 |   [ACTIONS.LEADS_ASSIGN]: ['owner', 'admin', 'buying_house', 'factory'],
   30 |   [ACTIONS.LEADS_EXPORT]: ['owner', 'admin', 'buying_house', 'factory'],
   31 |   [ACTIONS.ANALYTICS_VIEW_ORG]: ['owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'],
   32 |   [ACTIONS.ANALYTICS_VIEW_AGENT]: ['owner', 'admin', 'buying_house', 'factory', 'agent'],
   33 |   [ACTIONS.CONTRACTS_APPROVE]: ['owner', 'admin', 'buying_house', 'factory'],
   34 |   [ACTIONS.FILTERS_ADVANCED_ACCESS]: ['owner', 'admin', 'buying_house', 'factory', 'buyer', 'agent'],
   35 |   [ACTIONS.MEMBERS_MANAGE]: ['owner', 'admin', 'buying_house', 'factory'],
   36 |   [ACTIONS.ORG_SETTINGS_MANAGE]: ['owner', 'admin', 'buying_house', 'factory'],
   37 | }
   38 | const ROLE_FILTER_PRESETS = {
   39 |   owner: 'all_access',
   40 |   admin: 'all_access',
   41 |   buying_house: 'demand_ops',
   42 |   factory: 'supply_ops',
   43 |   buyer: 'buyer_focus',
   44 |   agent: 'team_scoped',
   45 | }
   46 | 
   47 | function roleOf(actor) {
   48 |   return String(actor?.role || '').toLowerCase()
   49 | }
   50 | 
   51 | function actorOrgId(actor) {
   52 |   if (!actor) return ''
   53 |   if (isAgent(actor)) return String(actor.org_owner_id || '')
   54 |   return String(actor.id || actor.org_owner_id || '')
   55 | }
   56 | 
   57 | function isPremium(actor) {
   58 |   return String(actor?.subscription_status || '').toLowerCase() === 'premium'
   59 | }
   60 | 
   61 | function teamMatches(actor, resourceContext) {
   62 |   const actorTeam = String(actor?.profile?.team || actor?.team || '')
   63 |   const actorSubTeam = String(actor?.profile?.sub_team || actor?.sub_team || '')
   64 |   const resourceTeam = String(resourceContext?.team || '')
   65 |   const resourceSubTeam = String(resourceContext?.sub_team || '')
   66 |   if (!resourceTeam) return true
   67 |   if (!actorTeam) return false
   68 |   if (actorTeam !== resourceTeam) return false
   69 |   if (!resourceSubTeam) return true
   70 |   return actorSubTeam === resourceSubTeam
   71 | }
   72 | 
   73 | function policyDecision({ allowed, reason, policyId, actor, action, resourceContext }) {
   74 |   return {
   75 |     allowed: Boolean(allowed),
   76 |     reason: reason || (allowed ? 'authorized' : 'forbidden'),
   77 |     policy_id: policyId,
   78 |     action,
   79 |     actor_id: String(actor?.id || ''),
   80 |     resource_context: resourceContext || {},
   81 |   }
   82 | }
   83 | 
   84 | async function auditDecision(decision) {
   85 |   await appendAuditLog({
   86 |     id: `authz:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`,
   87 |     type: decision.allowed ? 'authorization.granted' : 'authorization.denied',
   88 |     actor_id: decision.actor_id,
   89 |     action: decision.action,
   90 |     policy_id: decision.policy_id,
   91 |     decision: decision.allowed ? 'allow' : 'deny',
   92 |     reason: decision.reason,
   93 |     resource_context: decision.resource_context,
   94 |     created_at: new Date().toISOString(),
   95 |   })
   96 | }
   97 | 
   98 | function checkBasePermission(actor, action, resourceContext = {}) {
   99 |   const role = roleOf(actor)
  100 |   const allowedRoles = BASE_PERMISSION_MATRIX[action] || []
  101 |   if (!allowedRoles.includes(role)) {
  102 |     return policyDecision({
  103 |       allowed: false,
  104 |       reason: `Role ${role || 'unknown'} cannot perform ${action}`,
  105 |       policyId: POLICY_IDS.BASE_ROLE_ALLOW,
  106 |       actor,
  107 |       action,
  108 |       resourceContext,
  109 |     })
  110 |   }
  111 | 
  112 |   if (action === ACTIONS.FILTERS_ADVANCED_ACCESS && !isPremium(actor)) {
  113 |     return policyDecision({
  114 |       allowed: false,
  115 |       reason: 'Advanced filters require premium/enterprise plan',
  116 |       policyId: POLICY_IDS.FILTERS_ADVANCED_PLAN,
  117 |       actor,
  118 |       action,
  119 |       resourceContext,
  120 |     })
  121 |   }
  122 | 
  123 |   return policyDecision({
  124 |     allowed: true,
  125 |     reason: 'Role allow-list passed',
  126 |     policyId: POLICY_IDS.BASE_ROLE_ALLOW,
  127 |     actor,
  128 |     action,
  129 |     resourceContext,
  130 |   })
  131 | }
  132 | 
  133 | function applyEnterprisePolicies(actor, action, resourceContext = {}, baseDecision) {
  134 |   if (!baseDecision.allowed) return baseDecision
  135 | 
  136 |   if (action === ACTIONS.LEADS_ASSIGN && isAgent(actor)) {
  137 |     return policyDecision({
  138 |       allowed: false,
  139 |       reason: 'Agents cannot assign leads',
  140 |       policyId: POLICY_IDS.LEAD_ASSIGN_MANAGER,
  141 |       actor,
  142 |       action,
  143 |       resourceContext,
  144 |     })
  145 |   }
  146 | 
  147 |   if (action === ACTIONS.ANALYTICS_VIEW_AGENT && isAgent(actor)) {
  148 |     const targetAgentId = String(resourceContext?.target_agent_id || actor.id || '')
  149 |     if (targetAgentId && targetAgentId !== String(actor.id || '')) {
  150 |       return policyDecision({
  151 |         allowed: false,
  152 |         reason: 'Agents can only view their own analytics scope',
  153 |         policyId: POLICY_IDS.ANALYTICS_AGENT_SCOPE,
  154 |         actor,
  155 |         action,
  156 |         resourceContext,
  157 |       })
  158 |     }
  159 |   }
  160 | 
  161 |   if (action === ACTIONS.CONTRACTS_APPROVE && !ORG_MANAGER_ROLES.has(roleOf(actor))) {
  162 |     return policyDecision({
  163 |       allowed: false,
  164 |       reason: 'Contract approvals require org manager role',
  165 |       policyId: POLICY_IDS.CONTRACT_APPROVE,
  166 |       actor,
  167 |       action,
  168 |       resourceContext,
  169 |     })
  170 |   }
  171 | 
  172 |   if (action === ACTIONS.MEMBERS_MANAGE) {
  173 |     const seatCap = Number(resourceContext?.seat_cap || 0)
  174 |     const requestedSeats = Number(resourceContext?.requested_seats || 0)
  175 |     const activeSeats = Number(resourceContext?.active_seats || 0)
  176 |     if (seatCap > 0 && requestedSeats > 0 && activeSeats + requestedSeats > seatCap) {
  177 |       return policyDecision({
  178 |         allowed: false,
  179 |         reason: `Seat cap exceeded (${activeSeats + requestedSeats}/${seatCap})`,
  180 |         policyId: POLICY_IDS.SEAT_CAP,
  181 |         actor,
  182 |         action,
  183 |         resourceContext,
  184 |       })
  185 |     }
  186 |   }
  187 | 
  188 |   if ([ACTIONS.ANALYTICS_VIEW_ORG, ACTIONS.ANALYTICS_VIEW_AGENT, ACTIONS.LEADS_ASSIGN].includes(action)) {
  189 |     if (!teamMatches(actor, resourceContext)) {
  190 |       return policyDecision({
  191 |         allowed: false,
  192 |         reason: 'Restricted visibility outside your team/sub-team',
  193 |         policyId: POLICY_IDS.TEAM_VISIBILITY,
  194 |         actor,
  195 |         action,
  196 |         resourceContext,
  197 |       })
  198 |     }
  199 |   }
  200 | 
  201 |   if (action === ACTIONS.ORG_SETTINGS_MANAGE) {
  202 |     if (!ORG_MANAGER_ROLES.has(roleOf(actor))) {
  203 |       return policyDecision({
  204 |         allowed: false,
  205 |         reason: 'Only org managers can update organization settings',
  206 |         policyId: POLICY_IDS.ORG_SETTINGS,
  207 |         actor,
  208 |         action,
  209 |         resourceContext,
  210 |       })
  211 |     }
  212 |   }
  213 | 
  214 |   return baseDecision
  215 | }
  216 | 
  217 | export async function authorize(actor, action, resourceContext = {}) {
  218 |   const requestedAction = String(action || '')
  219 |   const baseDecision = checkBasePermission(actor, requestedAction, resourceContext)
  220 |   const decision = applyEnterprisePolicies(actor, requestedAction, resourceContext, baseDecision)
  221 |   await auditDecision(decision)
  222 |   if (!decision.allowed) throw forbiddenError(decision.reason)
  223 |   return decision
  224 | }
  225 | 
  226 | export function buildCapabilityPayload(actor) {
  227 |   const orgId = actorOrgId(actor)
  228 |   const team = String(actor?.profile?.team || actor?.team || '')
  229 |   const subTeam = String(actor?.profile?.sub_team || actor?.sub_team || '')
  230 |   const entries = Object.values(ACTIONS).map((action) => {
  231 |     const baseDecision = checkBasePermission(actor, action, { org_id: orgId, team, sub_team: subTeam })
  232 |     const decision = applyEnterprisePolicies(actor, action, { org_id: orgId, team, sub_team: subTeam }, baseDecision)
  233 |     return [action, Boolean(decision.allowed)]
  234 |   })
  235 |   const byAction = Object.fromEntries(entries)
  236 | 
  237 |   return {
  238 |     ...byAction,
  239 |     leads: {
  240 |       assign: Boolean(byAction[ACTIONS.LEADS_ASSIGN]),
  241 |       export: Boolean(byAction[ACTIONS.LEADS_EXPORT]),
  242 |     },
  243 |     analytics: {
  244 |       view_org: Boolean(byAction[ACTIONS.ANALYTICS_VIEW_ORG]),
  245 |       view_agent: Boolean(byAction[ACTIONS.ANALYTICS_VIEW_AGENT]),
  246 |     },
  247 |     contracts: {
  248 |       approve: Boolean(byAction[ACTIONS.CONTRACTS_APPROVE]),
  249 |     },
  250 |     filters: {
  251 |       advanced_access: Boolean(byAction[ACTIONS.FILTERS_ADVANCED_ACCESS]),
  252 |       advanced: Boolean(byAction[ACTIONS.FILTERS_ADVANCED_ACCESS]),
  253 |       preset: ROLE_FILTER_PRESETS[roleOf(actor)] || 'basic',
  254 |     },
  255 |     members: {
  256 |       manage: Boolean(byAction[ACTIONS.MEMBERS_MANAGE]),
  257 |     },
  258 |     org: {
  259 |       settings_manage: Boolean(byAction[ACTIONS.ORG_SETTINGS_MANAGE]),
  260 |     },
  261 |   }
  262 | }
  263 | 
  264 | export { ACTIONS, POLICY_IDS }
  265 | 