import { readJson } from '../utils/jsonStore.js'
import { readLocalJson } from '../utils/localStore.js'
import { listContracts } from '../services/documentService.js'
import { listReports } from '../services/reportService.js'
import { getAdminConfig } from '../services/adminConfigService.js'
import { listSubscriptionHistory } from '../services/subscriptionHistoryService.js'
import { listUsers } from '../services/userService.js'

function sortByDateDesc(rows = [], field = 'created_at') {
  return [...rows].sort((a, b) => String(b?.[field] || '').localeCompare(String(a?.[field] || '')))
}

function toBool(value) {
  if (typeof value === 'boolean') return value
  if (value === undefined || value === null || value === '') return undefined
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase())
}

function buildDuplicateIndex(rows = [], fields = []) {
  const map = new Map()
  for (const row of rows) {
    for (const field of fields) {
      const raw = String(row?.[field] || '').trim()
      if (!raw) continue
      const key = `${field}:${raw.toLowerCase()}`
      const bucket = map.get(key) || { field, value: raw, user_ids: [] }
      bucket.user_ids.push(row.user_id || row.id)
      map.set(key, bucket)
    }
  }
  return [...map.values()].filter((entry) => entry.user_ids.length > 1)
}

function normalizeRole(value) {
  return String(value || '').toLowerCase()
}

function getFieldValue(source, path) {
  if (!source || !path) return undefined
  return String(path)
    .split('.')
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source)
}

function toComparable(value) {
  if (value === undefined || value === null) return ''
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value
  return String(value).toLowerCase()
}

function matchesFilterValue(userValue, filterValue) {
  if (filterValue === undefined || filterValue === null || filterValue === '') return true
  if (Array.isArray(filterValue)) {
    return filterValue.map(toComparable).includes(toComparable(userValue))
  }
  if (typeof filterValue === 'object') {
    const inList = filterValue.$in || filterValue.in
    if (Array.isArray(inList)) {
      return inList.map(toComparable).includes(toComparable(userValue))
    }
    if (filterValue.contains !== undefined) {
      return String(userValue || '').toLowerCase().includes(String(filterValue.contains || '').toLowerCase())
    }
    if (filterValue.eq !== undefined) {
      return toComparable(userValue) === toComparable(filterValue.eq)
    }
  }
  return toComparable(userValue) === toComparable(filterValue)
}

function matchesSegmentFilter(user, filter) {
  if (!filter || typeof filter !== 'object') return true
  return Object.entries(filter).every(([key, value]) => {
    if (key === 'premium') {
      const premium = String(user.subscription_status || '').toLowerCase() === 'premium'
      return matchesFilterValue(premium, value)
    }
    if (key === 'verified') {
      return matchesFilterValue(Boolean(user.verified), value)
    }
    const userValue = getFieldValue(user, key)
    return matchesFilterValue(userValue, value)
  })
}

function parseFilter(raw) {
  if (!raw) return {}
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }
  return raw
}

export async function listSignupsAdmin(req, res) {
  const [users, subscriptions, verifications] = await Promise.all([
    listUsers(),
    readJson('subscriptions.json'),
    readJson('verification.json'),
  ])
  const subRows = Array.isArray(subscriptions) ? subscriptions : []
  const verificationRows = Array.isArray(verifications) ? verifications : []
  const role = normalizeRole(req.query?.role)
  const status = normalizeRole(req.query?.status)
  const region = normalizeRole(req.query?.region)
  const verified = toBool(req.query?.verified)
  const premium = toBool(req.query?.premium)

  const rows = (Array.isArray(users) ? users : []).filter((user) => {
    if (role && normalizeRole(user.role) !== role) return false
    if (status && normalizeRole(user.status) !== status) return false
    if (region && normalizeRole(user.region || user.country) !== region) return false
    if (verified !== undefined && Boolean(user.verified) !== verified) return false
    if (premium !== undefined) {
      const isPremium = String(user.subscription_status || '').toLowerCase() === 'premium'
      if (isPremium !== premium) return false
    }
    return true
  }).map((user) => {
    const sub = subRows.find((s) => String(s.user_id) === String(user.id))
    const verification = verificationRows.find((v) => String(v.user_id) === String(user.id))
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      region: user.region || user.country || '',
      verified: Boolean(user.verified),
      premium: String(user.subscription_status || '').toLowerCase() === 'premium',
      created_at: user.created_at,
      subscription: sub || null,
      verification: verification || null,
    }
  })

  return res.json({ items: sortByDateDesc(rows, 'created_at') })
}

export async function listStrikeHistoryAdmin(req, res) {
  const [violations, users] = await Promise.all([
    readJson('violations.json'),
    listUsers(),
  ])
  const vRows = Array.isArray(violations) ? violations : []
  const usersById = new Map((Array.isArray(users) ? users : []).map((u) => [String(u.id), u]))
  const items = sortByDateDesc(vRows).map((row) => ({
    ...row,
    user: (() => {
      const user = usersById.get(String(row.actor_id))
      if (!user) return null
      return { id: user.id, name: user.name, email: user.email, role: user.role }
    })(),
  }))
  return res.json({ items })
}

export async function listFraudReviewAdmin(req, res) {
  const [verifications, documents] = await Promise.all([
    readJson('verification.json'),
    readJson('documents.json'),
  ])
  const verificationRows = Array.isArray(verifications) ? verifications : []
  const documentRows = Array.isArray(documents) ? documents : []
  const flagged = verificationRows.filter((row) => Boolean(row.fraud_flag))
  const duplicates = buildDuplicateIndex(verificationRows, [
    'business_registration',
    'vat_ein',
    'eori',
    'bank_account',
    'tax_id',
    'company_registration',
  ])
  const docsByUser = documentRows.reduce((acc, doc) => {
    const key = String(doc.user_id || doc.owner_id || '')
    if (!key) return acc
    acc[key] = acc[key] || []
    acc[key].push(doc)
    return acc
  }, {})
  const items = flagged.map((row) => ({
    ...row,
    documents: docsByUser[String(row.user_id)] || [],
  }))
  return res.json({ items, duplicates })
}

export async function listOrgOwnershipAdmin(req, res) {
  const [users, config] = await Promise.all([listUsers(), getAdminConfig()])
  const userRows = Array.isArray(users) ? users : []
  const owners = userRows.filter((u) => ['buyer', 'factory', 'buying_house'].includes(normalizeRole(u.role)))
  const staffByOrg = new Map()
  const agentsByOrg = new Map()

  userRows.forEach((user) => {
    const orgId = String(user.org_owner_id || '')
    if (!orgId) return
    const list = staffByOrg.get(orgId) || []
    list.push(user)
    staffByOrg.set(orgId, list)
    if (normalizeRole(user.role) === 'agent') {
      const agents = agentsByOrg.get(orgId) || []
      agents.push(user)
      agentsByOrg.set(orgId, agents)
    }
  })

  const freeLimit = Number(config?.plan_limits?.free?.member_limit || 10)
  const premiumLimit = Number(config?.plan_limits?.premium?.member_limit || 50)

  const orgs = owners.map((owner) => {
    const orgId = String(owner.id)
    const staff = staffByOrg.get(orgId) || []
    const agents = agentsByOrg.get(orgId) || []
    const plan = String(owner.subscription_status || '').toLowerCase() === 'premium' ? 'premium' : 'free'
    const limit = plan === 'premium' ? premiumLimit : freeLimit
    return {
      org_owner_id: orgId,
      org_name: owner.company || owner.name || 'Organization',
      role: owner.role,
      region: owner.region || owner.country || '',
      premium: plan === 'premium',
      verified: Boolean(owner.verified),
      staff_count: staff.length,
      agent_count: agents.length,
      staff_limit: limit,
    }
  })

  const staff_list = [...staffByOrg.entries()].flatMap(([orgId, staff]) => (
    staff.map((member) => ({
      org_owner_id: orgId,
      id: member.id,
      name: member.name,
      role: member.role,
      status: member.status,
      region: member.region || '',
      created_at: member.created_at,
    }))
  ))

  return res.json({ orgs, staff_list })
}

export async function listWalletLedgerAdmin(req, res) {
  const [history, refunds] = await Promise.all([
    readJson('wallet_history.json'),
    readLocalJson('refund_log.json', []),
  ])
  const historyRows = Array.isArray(history) ? history : []
  const refundRows = Array.isArray(refunds) ? refunds : []
  const ledger = [
    ...historyRows.map((row) => ({ ...row, entry_type: row.type || 'wallet', created_at: row.created_at || row.at })),
    ...refundRows.map((row) => ({ ...row, entry_type: 'refund', created_at: row.created_at || row.at })),
  ]
  return res.json({ items: sortByDateDesc(ledger, 'created_at') })
}

export async function listPartnerRequestsAdmin(req, res) {
  const requests = await readJson('partner_requests.json')
  const rows = Array.isArray(requests) ? requests : []
  return res.json({ items: sortByDateDesc(rows) })
}

export async function listContractsAdmin(req, res) {
  const contracts = await listContracts(req.user)
  return res.json({ items: sortByDateDesc(contracts, 'updated_at') })
}

export async function listDisputesAdmin(req, res) {
  const reports = await listReports()
  const disputes = reports.filter((r) => String(r.entity_type || '') === 'contract_dispute')
  return res.json({ items: sortByDateDesc(disputes) })
}

export async function listCallsAdmin(req, res) {
  const calls = await readJson('call_sessions.json')
  const rows = Array.isArray(calls) ? calls : []
  const items = sortByDateDesc(rows).map((call) => {
    const hasRecording = Boolean(call.recording_url) || String(call.recording_status || '').toLowerCase() === 'available'
    const proofRequired = Boolean(call.proof_required)
    return {
      ...call,
      proof_verified: proofRequired ? hasRecording : false,
      proof_evidence: hasRecording ? 'recording' : '',
    }
  })
  return res.json({ items })
}

export async function listPaymentProofsAdmin(req, res) {
  const proofs = await readJson('payment_proofs.json')
  const rows = Array.isArray(proofs) ? proofs : []
  const items = sortByDateDesc(rows).map((proof) => ({
    ...proof,
    evidence_present: Boolean(proof.document_url || proof.file_url || proof.attachment_url),
  }))
  return res.json({ items })
}

export async function listWalletHistoryAdmin(req, res) {
  const history = await readJson('wallet_history.json')
  const rows = Array.isArray(history) ? history : []
  return res.json({ items: sortByDateDesc(rows) })
}

export async function listSearchAlertsAdmin(req, res) {
  const alerts = await readJson('search_alerts.json')
  const rows = Array.isArray(alerts) ? alerts : []
  return res.json({ items: sortByDateDesc(rows) })
}

export async function listSearchUsageAdmin(req, res) {
  const usage = await readJson('search_usage_counters.json')
  const rows = Array.isArray(usage) ? usage : []
  const config = await getAdminConfig()
  const threshold = Number(config?.search_limits?.abusive_search_threshold || 120)
  const flagged = rows.map((row) => ({ ...row, abusive: Number(row.count || 0) >= threshold }))
  return res.json({ items: flagged })
}

export async function listMatchesAdmin(req, res) {
  const matches = await readJson('matches.json')
  const rows = Array.isArray(matches) ? matches : []
  return res.json({ items: rows })
}

export async function listRequirementsAdmin(req, res) {
  const requirements = await readJson('requirements.json')
  const rows = Array.isArray(requirements) ? requirements : []
  return res.json({ items: sortByDateDesc(rows) })
}

export async function listSubscriptionHistoryAdmin(req, res) {
  const items = await listSubscriptionHistory({})
  return res.json({ items })
}

export async function listInvoicesAdmin(req, res) {
  const items = await readLocalJson('invoice_log.json', [])
  return res.json({ items })
}

export async function listPayoutsAdmin(req, res) {
  const items = await readLocalJson('payout_ledger.json', [])
  return res.json({ items })
}

export async function listRefundsAdmin(req, res) {
  const items = await readLocalJson('refund_log.json', [])
  return res.json({ items })
}

export async function listCouponReport(req, res) {
  const [codes, redemptions, users] = await Promise.all([
    readJson('coupon_codes.json'),
    readJson('coupon_redemptions.json'),
    readJson('users.json'),
  ])
  const codeRows = Array.isArray(codes) ? codes : []
  const redemptionRows = Array.isArray(redemptions) ? redemptions : []
  const usersRows = Array.isArray(users) ? users : []
  const userById = new Map(usersRows.map((u) => [String(u.id), u]))

  const byCode = codeRows.map((code) => {
    const redemptionsForCode = redemptionRows.filter((r) => String(r.code_id) === String(code.id))
    const total = redemptionsForCode.reduce((sum, r) => sum + Number(r.amount_usd || 0), 0)
    const uniqueUsers = new Set(redemptionsForCode.map((r) => String(r.user_id))).size
    const roles = redemptionsForCode.reduce((acc, r) => {
      const user = userById.get(String(r.user_id))
      const role = String(user?.role || 'unknown')
      acc[role] = (acc[role] || 0) + 1
      return acc
    }, {})
    return {
      code_id: code.id,
      code: code.code,
      active: code.active,
      marketing_source: code.marketing_source || '',
      campaign: code.campaign || '',
      role_restrictions: code.role_restrictions || [],
      max_redemptions: code.max_redemptions || null,
      redemption_count: redemptionsForCode.length,
      unique_users: uniqueUsers,
      redeemed_total_usd: Math.round(total * 100) / 100,
      average_redemption_usd: redemptionsForCode.length ? Math.round((total / redemptionsForCode.length) * 100) / 100 : 0,
      redemptions_by_role: roles,
    }
  })

  const byCampaign = byCode.reduce((acc, row) => {
    const key = row.campaign || 'uncategorized'
    acc[key] = acc[key] || { campaign: key, redemption_count: 0, redeemed_total_usd: 0, unique_users: new Set() }
    acc[key].redemption_count += row.redemption_count
    acc[key].redeemed_total_usd = Math.round((acc[key].redeemed_total_usd + row.redeemed_total_usd) * 100) / 100
    row.unique_users && acc[key].unique_users.add(row.unique_users)
    return acc
  }, {})

  return res.json({
    codes: byCode,
    campaigns: Object.values(byCampaign).map((row) => ({
      campaign: row.campaign,
      redemption_count: row.redemption_count,
      redeemed_total_usd: row.redeemed_total_usd,
      unique_users: row.unique_users instanceof Set ? row.unique_users.size : row.unique_users || 0,
    })),
  })
}

export async function listAiAuditLogs(req, res) {
  const notes = await readJson('lead_notes.json')
  const rows = Array.isArray(notes) ? notes : []
  const aiNotes = rows.filter((row) => String(row.note || '').startsWith('AI Summary:') || String(row.note || '').startsWith('AI Negotiation:'))
  return res.json({ items: sortByDateDesc(aiNotes) })
}

function toCsv(rows = []) {
  if (!rows.length) return 'email'
  const header = 'email'
  const lines = rows.map((row) => `"${String(row || '').replace(/"/g, '""')}"`)
  return [header, ...lines].join('\n')
}

export async function exportEmailSegmentAdmin(req, res) {
  const segmentId = String(req.query?.segment_id || '').trim()
  if (!segmentId) return res.status(400).json({ error: 'segment_id is required' })

  const [segments, users] = await Promise.all([
    readLocalJson('email_segments.json', []),
    listUsers(),
  ])

  const rows = Array.isArray(segments) ? segments : []
  const segment = rows.find((row) => String(row.id) === segmentId)
  if (!segment) return res.status(404).json({ error: 'segment not found' })

  const filter = parseFilter(segment.filter)
  const matches = (Array.isArray(users) ? users : []).filter((user) => matchesSegmentFilter(user, filter))
  const emails = [...new Set(matches.map((u) => u.email).filter(Boolean))]
  const csv = toCsv(emails)
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="segment_${segmentId}.csv"`)
  return res.send(csv)
}
