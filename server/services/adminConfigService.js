import fs from 'fs/promises'
import path from 'path'

const CONFIG_PATH = path.join(process.cwd(), 'server', 'database', 'admin_config.json')

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

async function ensureConfigFile() {
  try {
    await fs.access(CONFIG_PATH)
  } catch {
    await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true })
    await fs.writeFile(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8')
  }
}

export async function getAdminConfig() {
  await ensureConfigFile()
  const raw = await fs.readFile(CONFIG_PATH, 'utf8')
  try {
    const parsed = JSON.parse(raw)
    return mergeDeep(DEFAULT_CONFIG, parsed || {})
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

export async function updateAdminConfig(patch = {}) {
  const current = await getAdminConfig()
  const next = mergeDeep(current, patch)
  await fs.writeFile(CONFIG_PATH, JSON.stringify(next, null, 2), 'utf8')
  return next
}
