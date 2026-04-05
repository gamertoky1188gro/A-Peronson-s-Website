import { readLocalJson, writeLocalJson } from '../utils/localStore.js'

const DEFAULT_CONFIG = {
  feature_flags: {
    ai_summaries: true,
    auto_credit: true,
    bulk_approvals: false,
    system_broadcasts: true,
  },
  plan_limits: {
    free: {
      partner_limit: 5,
      search_daily: 20,
      request_limit: 3,
      product_limit: 20,
      video_limit: 2,
      agent_limit: 10,
    },
    premium: {
      partner_limit: 50,
      search_daily: 200,
      request_limit: 50,
      product_limit: 500,
      video_limit: 200,
      agent_limit: 999,
    },
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
    opensearch: {
      enabled: false,
      url: '',
      username: '',
      password: '',
      index_prefix: 'gartexhub_',
      timeout_ms: 3000,
      verify_tls: true,
    },
  },
  notifications: {
    templates: [],
    monthly_summary_enabled: true,
    email: {
      enabled: false,
      provider: 'smtp',
      from_name: 'GarTexHub',
      from_email: '',
      test_recipient: '',
    },
  },
  analytics: {
    search_min_events: 25,
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
  moderation: {
    clothing_rules: {
      forbidden_terms: [],
      flag_terms: [],
      allowed_terms: [],
      context_exceptions: [],
      reason_templates: {
        rejected: 'This listing appears to include indecent or revealing clothing. Please adjust images or description to match our content standards for modest apparel.',
        pending_review: 'This listing needs a manual review to confirm it follows our content standards.',
        fix_guidance: 'Update images, title, or description to describe modest apparel. Innerwear or under-layer items must be clearly labeled.',
      },
    },
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
