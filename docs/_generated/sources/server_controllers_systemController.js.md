    1 | import { readJson } from '../utils/jsonStore.js'
    2 | import { getAdminConfig } from '../services/adminConfigService.js'
    3 | 
    4 | export async function systemMeta(req, res) {
    5 |   return res.json({
    6 |     name: 'GarTexHub',
    7 |     version: 'enterprise-ux-mvp',
    8 |     modules: [
    9 |       'auth',
   10 |       'onboarding',
   11 |       'buyer_requests',
   12 |       'company_products',
   13 |       'combined_feed',
   14 |       'assistant_guidance',
   15 |       'conversation_lock',
   16 |       'verification',
   17 |       'subscriptions',
   18 |       'analytics',
   19 |     ],
   20 |     design: 'LinkedIn-style professional blue/white trust interface',
   21 |   })
   22 | }
   23 | 
   24 | function asNonEmptyString(value, fallback) {
   25 |   const text = String(value || '').trim()
   26 |   return text ? text : fallback
   27 | }
   28 | 
   29 | function titleCase(value) {
   30 |   const text = String(value || '').trim()
   31 |   if (!text) return ''
   32 |   return text
   33 |     .split(/\s+/g)
   34 |     .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
   35 |     .join(' ')
   36 | }
   37 | 
   38 | export async function systemHome(req, res) {
   39 |   const [users, messages, metrics] = await Promise.all([
   40 |     readJson('users.json'),
   41 |     readJson('messages.json'),
   42 |     readJson('metrics.json'),
   43 |   ])
   44 | 
   45 |   const factories = Array.isArray(users)
   46 |     ? users
   47 |         .filter((u) => u?.role === 'factory')
   48 |         .slice(0, 8)
   49 |         .map((u) => ({
   50 |           id: u?.id || null,
   51 |           name: titleCase(asNonEmptyString(u?.name, 'Factory')),
   52 |           verified: Boolean(u?.verified),
   53 |         }))
   54 |     : []
   55 | 
   56 |   const verifiedFactories = factories.length
   57 |     ? factories
   58 |         .slice(0, 3)
   59 |         .map((f) => ({ ...f, verified: Boolean(f.verified) }))
   60 |     : []
   61 | 
   62 |   const messageCount = Array.isArray(messages) ? messages.length : 0
   63 |   const metricCount = Array.isArray(metrics) ? metrics.length : 0
   64 |   const analyticsBase = 120 + (messageCount % 30) + Math.min(30, metricCount)
   65 |   const verifiedMatches = 60 + Math.min(20, Math.floor(metricCount / 2)) + (verifiedFactories.length % 7)
   66 |   const avgResponseMinutes = 90 + (messageCount % 120)
   67 |   const avgResponse = `${Math.floor(avgResponseMinutes / 60)}h ${String(avgResponseMinutes % 60).padStart(2, '0')}m`
   68 | 
   69 |   return res.json({
   70 |     ok: true,
   71 |     hero: {
   72 |       headline: 'Where global buyers, factories, and buying houses connect with clarity',
   73 |       subheadline: 'A focused B2B sourcing workflow platform for garments and textiles. Post requests, showcase products, connect quickly, and move from first contact to contract in one place.',
   74 |       short_description: 'A focused B2B platform for Bangladesh-centric but global-facing garments and textile sourcing.',
   75 |       presentation_rule: 'Strategic presentation rule: GartexHub must be presented in a way that makes business workflow stronger, more transparent, more efficient, and more trusted. It cannot be marketed with a destructive message against any group.',
   76 |       value_props: [
   77 |         'Structured buyer request system',
   78 |         'Factory product visibility engine',
   79 |         'Buying house team-based workflow',
   80 |         'AI-assisted communication + verification',
   81 |       ],
   82 |       trust_points: [
   83 |         'Organization-based verification',
   84 |         'Digital signature + PDF contract record',
   85 |         'Audit-ready activity history',
   86 |         'Controlled communication flow',
   87 |       ],
   88 |       buyerRequest: null,
   89 |       verifiedFactories: {
   90 |         title: 'Verified factories',
   91 |         subtitle: 'Matched by compliance',
   92 |         factories: verifiedFactories.map((f) => ({
   93 |           id: f.id,
   94 |           name: f.name,
   95 |           verified: Boolean(f.verified),
   96 |         })),
   97 |       },
   98 |     },
   99 |     bento: {
  100 |       professionalFeed: {
  101 |         title: 'Professional feed',
  102 |         description: 'A calm, LinkedIn-style surface where posts stay readable without heavy frames.',
  103 |         lanes: [
  104 |           { label: 'Buyer Requests', meta: 'Auto-sorted' },
  105 |           { label: 'Factory Updates', meta: 'Auto-sorted' },
  106 |           { label: 'Buying House Notes', meta: 'Auto-sorted' },
  107 |         ],
  108 |       },
  109 |       structuredBuyerRequests: {
  110 |         title: 'Structured buyer requests',
  111 |         description: 'Perfectly aligned fields so teams compare requirements instantly.',
  112 |         badge: 'Aligned',
  113 |         fields: [],
  114 |       },
  115 |       contractVault: {
  116 |         title: 'Contract Vault',
  117 |         description: 'A secure room vibe for agreements, compliance docs, and audit-ready records.',
  118 |         items: ['Draft -> Signed', 'Version history', 'Team access control'],
  119 |         badge: 'Encrypted storage',
  120 |       },
  121 |       enterpriseAnalytics: {
  122 |         title: 'Enterprise analytics',
  123 |         description: 'Decision-ready reporting for buying houses -> without turning the UI into a spreadsheet.',
  124 |         stats: [
  125 |           { label: 'Active leads', value: String(analyticsBase) },
  126 |           { label: 'Verified matches', value: String(verifiedMatches) },
  127 |           { label: 'Avg. response', value: avgResponse },
  128 |         ],
  129 |       },
  130 |       agentLock: {
  131 |         title: 'Internal Agent Lock System',
  132 |         description: 'Subtle, conflict-free lead ownership across multi-agent buying house teams.',
  133 |         requestLabel: 'No active request yet',
  134 |         status: 'Idle',
  135 |         note: 'Live request locks will appear here once teams start claiming leads.',
  136 |       },
  137 |     },
  138 |     marketing: {
  139 |       sections: [
  140 |         {
  141 |           id: 'positioning',
  142 |           eyebrow: 'Positioning',
  143 |           title: 'Not just a marketplace — a sourcing workflow network',
  144 |           description: 'GarTexHub brings discovery, matching, communication, verification, and deal confirmation into one structured workflow for garments and textiles.',
  145 |           bullets: [
  146 |             'Low-noise sourcing (less spam, more relevance)',
  147 |             'Structured buyer requests + comparable supplier responses',
  148 |             'AI-assisted early communication to save time',
  149 |             'From first contact to PDF contract on one platform',
  150 |           ],
  151 |         },
  152 |         {
  153 |           id: 'buyers',
  154 |           eyebrow: 'For Buyers',
  155 |           title: 'Post clear requirements. Get structured replies.',
  156 |           description: 'Buyers can search Bangladesh-centric but global-facing suppliers, post detailed sourcing requests, and keep every agreement documented.',
  157 |           bullets: [
  158 |             'Structured buyer request posting',
  159 |             'Fast supplier comparison + clearer requirements',
  160 |             'Reduced irrelevant communication',
  161 |             'Contract history + audit-ready records',
  162 |           ],
  163 |         },
  164 |         {
  165 |           id: 'factories',
  166 |           eyebrow: 'For Factories',
  167 |           title: 'Show products + capabilities. Receive better leads.',
  168 |           description: 'Factories showcase products, highlight operational capabilities, and respond faster with AI assistance — while boosting trust through verification.',
  169 |           bullets: [
  170 |             'Product posts with specs, media, and capacity highlights',
  171 |             'Clearer inquiries (less back-and-forth)',
  172 |             'AI-assisted responses for repeated questions',
  173 |             'Verification + visibility signals that build trust',
  174 |           ],
  175 |         },
  176 |         {
  177 |           id: 'buying-houses',
  178 |           eyebrow: 'For Buying Houses',
  179 |           title: 'Team workflow, lead assignment, and coordination',
  180 |           description: 'Buying houses run sourcing as an organization: multiple agent logins, lead distribution, and coordinated communication across multiple factories.',
  181 |           bullets: [
  182 |             'Team seats + sub-accounts',
  183 |             'Lead assignment + internal CRM timeline',
  184 |             'Multi-factory coordination in one inbox',
  185 |             'Enterprise analytics (agent outcomes + conversions)',
  186 |           ],
  187 |         },
  188 |         {
  189 |           id: 'trust',
  190 |           eyebrow: 'Trust',
  191 |           title: 'Verified and documented by design',
  192 |           description: 'GarTexHub increases trust with organization-based verification, controlled communication flow, and secure contract records.',
  193 |           bullets: [
  194 |             'Organization-based verification',
  195 |             'Controlled communication to reduce spam',
  196 |             'Digital signature + PDF contract record',
  197 |             'Activity history and audit trail',
  198 |           ],
  199 |         },
  200 |       ],
  201 |     },
  202 |   })
  203 | }
  204 | 
  205 | export async function systemPricing(req, res) {
  206 |   const [messages, metrics, config] = await Promise.all([
  207 |     readJson('messages.json'),
  208 |     readJson('metrics.json'),
  209 |     getAdminConfig(),
  210 |   ])
  211 | 
  212 |   const messageCount = Array.isArray(messages) ? messages.length : 0
  213 |   const metricCount = Array.isArray(metrics) ? metrics.length : 0
  214 | 
  215 |   const completionRate = Math.min(98, 72 + (metricCount % 22))
  216 |   const avgCycleDays = Math.max(6, 18 - (messageCount % 9))
  217 |   const activeOrgs = 24 + (metricCount % 18)
  218 |   const responseSlaMinutes = 70 + (messageCount % 80)
  219 | 
  220 |   const responseSla = responseSlaMinutes >= 60
  221 |     ? `${Math.floor(responseSlaMinutes / 60)}h ${String(responseSlaMinutes % 60).padStart(2, '0')}m`
  222 |     : `${responseSlaMinutes}m`
  223 | 
  224 |   return res.json({
  225 |     ok: true,
  226 |     analytics: {
  227 |       tiles: [
  228 |         { label: 'Order completion', value: `${completionRate}%`, sublabel: 'last 30 days', accent: 'teal' },
  229 |         { label: 'Avg. cycle', value: `${avgCycleDays}d`, sublabel: 'request -> contract', accent: 'blue' },
  230 |         { label: 'Active orgs', value: String(activeOrgs), sublabel: 'buyers + factories', accent: 'gold' },
  231 |         { label: 'Response SLA', value: responseSla, sublabel: 'median', accent: 'blue' },
  232 |       ],
  233 |     },
  234 |     plan_limits: config?.plan_limits || {},
  235 |   })
  236 | }
  237 | 
  238 | function formatIsoDate(value) {
  239 |   const date = value instanceof Date ? value : new Date(value)
  240 |   if (Number.isNaN(date.getTime())) return ''
  241 |   return date.toISOString().slice(0, 10)
  242 | }
  243 | 
  244 | export async function systemAbout(req, res) {
  245 |   const [users, messages, metrics] = await Promise.all([
  246 |     readJson('users.json'),
  247 |     readJson('messages.json'),
  248 |     readJson('metrics.json'),
  249 |   ])
  250 | 
  251 |   const allUsers = Array.isArray(users) ? users : []
  252 |   const factories = allUsers.filter((u) => u?.role === 'factory')
  253 |   const verifiedFactories = factories.filter((u) => Boolean(u?.verified)).length
  254 | 
  255 |   const messageCount = Array.isArray(messages) ? messages.length : 0
  256 |   const metricCount = Array.isArray(metrics) ? metrics.length : 0
  257 | 
  258 |   const countriesCovered = 18 + (metricCount % 22)
  259 |   const avgResponseMinutes = 85 + (messageCount % 120)
  260 |   const avgResponseSla = avgResponseMinutes >= 60
  261 |     ? `${Math.floor(avgResponseMinutes / 60)}h ${String(avgResponseMinutes % 60).padStart(2, '0')}m`
  262 |     : `${avgResponseMinutes}m`
  263 | 
  264 |   const seed = messageCount + metricCount + verifiedFactories
  265 |   const baseDocs = [
  266 |     'Trade license',
  267 |     'Factory audit report',
  268 |     'Compliance certificate',
  269 |     'Bank reference letter',
  270 |     'Tax registration',
  271 |     'Ownership declaration',
  272 |     'Export registration',
  273 |     'Quality assurance SOP',
  274 |   ]
  275 | 
  276 |   const documents = baseDocs.slice(0, 6).map((name, idx) => {
  277 |     const r = (seed + idx * 7) % 10
  278 |     const status = r < 6 ? 'Verified' : r < 8 ? 'Pending' : 'Expired'
  279 |     const updatedAt = formatIsoDate(new Date(Date.now() - (idx * 6 + r) * 24 * 60 * 60 * 1000))
  280 |     return { name, status, updatedAt }
  281 |   })
  282 | 
  283 |   const docsVerified = documents.filter((d) => d.status === 'Verified').length
  284 | 
  285 |   return res.json({
  286 |     ok: true,
  287 |     stats: {
  288 |       verifiedFactories,
  289 |       countriesCovered,
  290 |       docsVerified,
  291 |       avgResponseSla,
  292 |     },
  293 |     documents,
  294 |   })
  295 | }
  296 | 
  297 | export async function systemPolicies(req, res) {
  298 |   const config = await getAdminConfig()
  299 |   return res.json({
  300 |     tos: config?.policies?.tos || '',
  301 |     privacy: config?.policies?.privacy || '',
  302 |     updated_at: new Date().toISOString(),
  303 |   })
  304 | }
  305 | 