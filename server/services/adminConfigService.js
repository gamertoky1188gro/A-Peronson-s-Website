import { readLocalJson, writeLocalJson } from '../utils/localStore.js'

const DEFAULT_CONFIG = {
  feature_flags: {
    ai_summaries: true,
    auto_credit: true,
    bulk_approvals: false,
    system_broadcasts: true,
  },
  plan_limits: {
    free: { partner_limit: 5, search_daily: 20, request_limit: 3 },
    premium: { partner_limit: 50, search_daily: 200, request_limit: 50 },
  },
  pricing: {
    free_usd: 0,
    premium_usd: 299,
  },
  policies: {
    tos: 'Standard platform terms apply.',
    privacy: 'Standard privacy policy applies.',
  },
  retention: {
    audit_days: 365,
    logs_days: 90,
  },
  integrations: {
    payment_gateways: [],
    webhooks: [],
    api_keys: [],
    crm_exports: [],
  },
  notifications: {
    templates: [],
    monthly_summary_enabled: true,
  },
  support: {
    sla_targets: {
      response_minutes: 60,
      resolution_hours: 72,
    },
  },
  search_limits: {
    advanced_filter_gate: true,
    abusive_search_threshold: 120,
  },
  partner_controls: {
    blacklist: [],
    whitelist: [],
  },
  org_quotas: {},
}

export async function getAdminConfig() {
  const parsed = await readLocalJson('admin_config.json', DEFAULT_CONFIG)
  return mergeDeep(DEFAULT_CONFIG, parsed || {})
}

export async function updateAdminConfig(patch = {}) {
  const current = await getAdminConfig()
  const next = mergeDeep(current, patch)
  await writeLocalJson('admin_config.json', next)
  return next
}

function mergeDeep(target, source) {
  if (!source || typeof source !== 'object') return target
  const output = { ...target }
  Object.entries(source).forEach(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      output[key] = mergeDeep(output[key] || {}, value)
    } else {
      output[key] = value
    }
  })
  return output
}
