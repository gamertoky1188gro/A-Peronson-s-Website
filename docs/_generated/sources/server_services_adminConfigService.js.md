    1 | import { readLocalJson, writeLocalJson } from '../utils/localStore.js'
    2 | 
    3 | const DEFAULT_CONFIG = {
    4 |   feature_flags: {
    5 |     ai_summaries: true,
    6 |     auto_credit: true,
    7 |     bulk_approvals: false,
    8 |     system_broadcasts: true,
    9 |   },
   10 |   plan_limits: {
   11 |     free: {
   12 |       partner_limit: 5,
   13 |       search_daily: 20,
   14 |       request_limit: 3,
   15 |       product_limit: 20,
   16 |       video_limit: 2,
   17 |       agent_limit: 10,
   18 |     },
   19 |     premium: {
   20 |       partner_limit: 50,
   21 |       search_daily: 200,
   22 |       request_limit: 50,
   23 |       product_limit: 500,
   24 |       video_limit: 200,
   25 |       agent_limit: 999,
   26 |     },
   27 |   },
   28 |   pricing: {
   29 |     free_usd: 0,
   30 |     premium_usd: 299,
   31 |   },
   32 |   policies: {
   33 |     tos: 'Standard platform terms apply.',
   34 |     privacy: 'Standard privacy policy applies.',
   35 |   },
   36 |   retention: {
   37 |     audit_days: 365,
   38 |     logs_days: 90,
   39 |   },
   40 |   integrations: {
   41 |     payment_gateways: [],
   42 |     webhooks: [],
   43 |     api_keys: [],
   44 |     crm_exports: [],
   45 |     opensearch: {
   46 |       enabled: false,
   47 |       url: '',
   48 |       username: '',
   49 |       password: '',
   50 |       index_prefix: 'gartexhub_',
   51 |       timeout_ms: 3000,
   52 |       verify_tls: true,
   53 |     },
   54 |   },
   55 |   notifications: {
   56 |     templates: [],
   57 |     monthly_summary_enabled: true,
   58 |     email: {
   59 |       enabled: false,
   60 |       provider: 'smtp',
   61 |       from_name: 'GarTexHub',
   62 |       from_email: '',
   63 |       test_recipient: '',
   64 |     },
   65 |   },
   66 |   analytics: {
   67 |     search_min_events: 25,
   68 |     governance: {
   69 |       enabled: true,
   70 |       min_cohort_size: 10,
   71 |       geo_granularity: 'country',
   72 |       retention_days: 365,
   73 |       allow_raw_exports: false,
   74 |       export_allowed_roles: ['admin', 'owner'],
   75 |       view_allowed_roles: ['admin', 'owner'],
   76 |     },
   77 |   },
   78 |   support: {
   79 |     sla_targets: {
   80 |       response_minutes: 60,
   81 |       resolution_hours: 72,
   82 |     },
   83 |   },
   84 |   search_limits: {
   85 |     advanced_filter_gate: true,
   86 |     abusive_search_threshold: 120,
   87 |   },
   88 |   partner_controls: {
   89 |     blacklist: [],
   90 |     whitelist: [],
   91 |   },
   92 |   moderation: {
   93 |     clothing_rules: {
   94 |       forbidden_terms: [],
   95 |       flag_terms: [],
   96 |       allowed_terms: [],
   97 |       context_exceptions: [],
   98 |       reason_templates: {
   99 |         rejected: 'This listing appears to include indecent or revealing clothing. Please adjust images or description to match our content standards for modest apparel.',
  100 |         pending_review: 'This listing needs a manual review to confirm it follows our content standards.',
  101 |         fix_guidance: 'Update images, title, or description to describe modest apparel. Innerwear or under-layer items must be clearly labeled.',
  102 |       },
  103 |     },
  104 |   },
  105 |   org_quotas: {},
  106 | }
  107 | 
  108 | export async function getAdminConfig() {
  109 |   const parsed = await readLocalJson('admin_config.json', DEFAULT_CONFIG)
  110 |   return mergeDeep(DEFAULT_CONFIG, parsed || {})
  111 | }
  112 | 
  113 | export async function updateAdminConfig(patch = {}) {
  114 |   const current = await getAdminConfig()
  115 |   const next = mergeDeep(current, patch)
  116 |   await writeLocalJson('admin_config.json', next)
  117 |   return next
  118 | }
  119 | 
  120 | function mergeDeep(target, source) {
  121 |   if (!source || typeof source !== 'object') return target
  122 |   const output = { ...target }
  123 |   Object.entries(source).forEach(([key, value]) => {
  124 |     if (value && typeof value === 'object' && !Array.isArray(value)) {
  125 |       output[key] = mergeDeep(output[key] || {}, value)
  126 |     } else {
  127 |       output[key] = value
  128 |     }
  129 |   })
  130 |   return output
  131 | }
  132 | 