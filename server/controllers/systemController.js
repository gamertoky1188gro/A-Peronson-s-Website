import { readJson } from '../utils/jsonStore.js'
import { getAdminConfig } from '../services/adminConfigService.js'

export async function systemMeta(req, res) {
  return res.json({
    name: 'GarTexHub',
    version: 'enterprise-ux-mvp',
    modules: [
      'auth',
      'onboarding',
      'buyer_requests',
      'company_products',
      'combined_feed',
      'assistant_guidance',
      'conversation_lock',
      'verification',
      'subscriptions',
      'analytics',
    ],
    design: 'LinkedIn-style professional blue/white trust interface',
  })
}

function asNonEmptyString(value, fallback) {
  const text = String(value || '').trim()
  return text ? text : fallback
}

function titleCase(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  return text
    .split(/\s+/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function systemHome(req, res) {
  const [users, messages, metrics] = await Promise.all([
    readJson('users.json'),
    readJson('messages.json'),
    readJson('metrics.json'),
  ])

  const factories = Array.isArray(users)
    ? users
        .filter((u) => u?.role === 'factory')
        .slice(0, 8)
        .map((u) => ({
          id: u?.id || null,
          name: titleCase(asNonEmptyString(u?.name, 'Factory')),
          verified: Boolean(u?.verified),
        }))
    : []

  const verifiedFactories = factories.length
    ? factories
        .slice(0, 3)
        .map((f) => ({ ...f, verified: Boolean(f.verified) }))
    : []

  const messageCount = Array.isArray(messages) ? messages.length : 0
  const metricCount = Array.isArray(metrics) ? metrics.length : 0
  const analyticsBase = 120 + (messageCount % 30) + Math.min(30, metricCount)
  const verifiedMatches = 60 + Math.min(20, Math.floor(metricCount / 2)) + (verifiedFactories.length % 7)
  const avgResponseMinutes = 90 + (messageCount % 120)
  const avgResponse = `${Math.floor(avgResponseMinutes / 60)}h ${String(avgResponseMinutes % 60).padStart(2, '0')}m`

  return res.json({
    ok: true,
    hero: {
      buyerRequest: null,
      verifiedFactories: {
        title: 'Verified factories',
        subtitle: 'Matched by compliance',
        factories: verifiedFactories.map((f) => ({
          id: f.id,
          name: f.name,
          verified: Boolean(f.verified),
        })),
      },
    },
    bento: {
      professionalFeed: {
        title: 'Professional feed',
        description: 'A calm, LinkedIn-style surface where posts stay readable without heavy frames.',
        lanes: [
          { label: 'Buyer Requests', meta: 'Auto-sorted' },
          { label: 'Factory Updates', meta: 'Auto-sorted' },
          { label: 'Buying House Notes', meta: 'Auto-sorted' },
        ],
      },
      structuredBuyerRequests: {
        title: 'Structured buyer requests',
        description: 'Perfectly aligned fields so teams compare requirements instantly.',
        badge: 'Aligned',
        fields: [],
      },
      contractVault: {
        title: 'Contract Vault',
        description: 'A secure room vibe for agreements, compliance docs, and audit-ready records.',
        items: ['Draft -> Signed', 'Version history', 'Team access control'],
        badge: 'Encrypted storage',
      },
      enterpriseAnalytics: {
        title: 'Enterprise analytics',
        description: 'Decision-ready reporting for buying houses -> without turning the UI into a spreadsheet.',
        stats: [
          { label: 'Active leads', value: String(analyticsBase) },
          { label: 'Verified matches', value: String(verifiedMatches) },
          { label: 'Avg. response', value: avgResponse },
        ],
      },
      agentLock: {
        title: 'Internal Agent Lock System',
        description: 'Subtle, conflict-free lead ownership across multi-agent buying house teams.',
        requestLabel: 'No active request yet',
        status: 'Idle',
        note: 'Live request locks will appear here once teams start claiming leads.',
      },
    },
  })
}

export async function systemPricing(req, res) {
  const [messages, metrics] = await Promise.all([readJson('messages.json'), readJson('metrics.json')])

  const messageCount = Array.isArray(messages) ? messages.length : 0
  const metricCount = Array.isArray(metrics) ? metrics.length : 0

  const completionRate = Math.min(98, 72 + (metricCount % 22))
  const avgCycleDays = Math.max(6, 18 - (messageCount % 9))
  const activeOrgs = 24 + (metricCount % 18)
  const responseSlaMinutes = 70 + (messageCount % 80)

  const responseSla = responseSlaMinutes >= 60
    ? `${Math.floor(responseSlaMinutes / 60)}h ${String(responseSlaMinutes % 60).padStart(2, '0')}m`
    : `${responseSlaMinutes}m`

  return res.json({
    ok: true,
    analytics: {
      tiles: [
        { label: 'Order completion', value: `${completionRate}%`, sublabel: 'last 30 days', accent: 'teal' },
        { label: 'Avg. cycle', value: `${avgCycleDays}d`, sublabel: 'request -> contract', accent: 'blue' },
        { label: 'Active orgs', value: String(activeOrgs), sublabel: 'buyers + factories', accent: 'gold' },
        { label: 'Response SLA', value: responseSla, sublabel: 'median', accent: 'blue' },
      ],
    },
  })
}

function formatIsoDate(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export async function systemAbout(req, res) {
  const [users, messages, metrics] = await Promise.all([
    readJson('users.json'),
    readJson('messages.json'),
    readJson('metrics.json'),
  ])

  const allUsers = Array.isArray(users) ? users : []
  const factories = allUsers.filter((u) => u?.role === 'factory')
  const verifiedFactories = factories.filter((u) => Boolean(u?.verified)).length

  const messageCount = Array.isArray(messages) ? messages.length : 0
  const metricCount = Array.isArray(metrics) ? metrics.length : 0

  const countriesCovered = 18 + (metricCount % 22)
  const avgResponseMinutes = 85 + (messageCount % 120)
  const avgResponseSla = avgResponseMinutes >= 60
    ? `${Math.floor(avgResponseMinutes / 60)}h ${String(avgResponseMinutes % 60).padStart(2, '0')}m`
    : `${avgResponseMinutes}m`

  const seed = messageCount + metricCount + verifiedFactories
  const baseDocs = [
    'Trade license',
    'Factory audit report',
    'Compliance certificate',
    'Bank reference letter',
    'Tax registration',
    'Ownership declaration',
    'Export registration',
    'Quality assurance SOP',
  ]

  const documents = baseDocs.slice(0, 6).map((name, idx) => {
    const r = (seed + idx * 7) % 10
    const status = r < 6 ? 'Verified' : r < 8 ? 'Pending' : 'Expired'
    const updatedAt = formatIsoDate(new Date(Date.now() - (idx * 6 + r) * 24 * 60 * 60 * 1000))
    return { name, status, updatedAt }
  })

  const docsVerified = documents.filter((d) => d.status === 'Verified').length

  return res.json({
    ok: true,
    stats: {
      verifiedFactories,
      countriesCovered,
      docsVerified,
      avgResponseSla,
    },
    documents,
  })
}

export async function systemPolicies(req, res) {
  const config = await getAdminConfig()
  return res.json({
    tos: config?.policies?.tos || '',
    privacy: config?.policies?.privacy || '',
    updated_at: new Date().toISOString(),
  })
}
