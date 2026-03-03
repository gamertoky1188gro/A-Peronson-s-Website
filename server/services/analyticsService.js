import crypto from 'crypto'
import { readJson, writeJson } from '../utils/jsonStore.js'
import { canViewAnalytics, canViewAnalyticsAdmin, forbiddenError, scopeRecordsForUser } from '../utils/permissions.js'

const FILE = 'analytics.json'

export async function trackEvent({ type, actor_id, entity_id, metadata = {} }) {
  const all = await readJson(FILE)
  all.push({
    id: crypto.randomUUID(),
    type,
    actor_id,
    entity_id,
    metadata,
    created_at: new Date().toISOString(),
  })
  await writeJson(FILE, all)
}

function ensureAnalyticsAccess(user) {
  if (canViewAnalytics(user)) return
  throw forbiddenError()
}

function ensureAnalyticsAdminAccess(user) {
  if (canViewAnalyticsAdmin(user)) return
  throw forbiddenError()
}

function scopeAnalyticsRecords(user, records, idFields) {
  return scopeRecordsForUser(user, records, {
    idFields,
    assignmentFields: ['assigned_agent_id', 'agent_id'],
  })
}

export async function getAnalyticsSummary(user) {
  ensureAnalyticsAccess(user)
  const all = await readJson(FILE)
  const scoped = scopeAnalyticsRecords(user, all, ['actor_id', 'entity_id'])
  const byType = scoped.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})
  return { total_events: scoped.length, by_type: byType }
}

function monthKey(value) {
  const d = new Date(value || '')
  if (Number.isNaN(d.getTime())) return null
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function toMonthlySeries(items, dateKey) {
  const bucket = items.reduce((acc, item) => {
    const key = monthKey(item[dateKey])
    if (!key) return acc
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return Object.entries(bucket)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }))
}

export async function getDashboardAnalytics(user) {
  ensureAnalyticsAdminAccess(user)

  const [events, requirements, messages, matches, documents, users] = await Promise.all([
    readJson(FILE),
    readJson('requirements.json'),
    readJson('messages.json'),
    readJson('matches.json'),
    readJson('documents.json'),
    readJson('users.json'),
  ])

  const scopedEvents = scopeAnalyticsRecords(user, events, ['actor_id', 'entity_id'])
  const scopedRequirements = scopeAnalyticsRecords(user, requirements, ['buyer_id', 'requester_id'])
  const scopedMessages = scopeAnalyticsRecords(user, messages, ['sender_id', 'receiver_id'])
  const scopedMatches = scopeAnalyticsRecords(user, matches, ['buyer_id', 'factory_id'])
  const scopedDocuments = scopeAnalyticsRecords(user, documents, ['uploaded_by', 'buyer_id', 'factory_id', 'entity_id'])

  const uniqueActiveChats = new Set(scopedMessages.map((m) => m.match_id).filter(Boolean)).size
  const connectedPartners = new Set(scopedMatches.map((m) => m.factory_id).filter(Boolean)).size
  const contractDocs = scopedDocuments.filter((d) => d.entity_type === 'contract' || String(d.type || '').toLowerCase().includes('contract'))
  const byType = scopedEvents.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1
    return acc
  }, {})

  return {
    totals: {
      buyer_requests: scopedRequirements.length,
      open_buyer_requests: scopedRequirements.filter((r) => r.status === 'open').length,
      chats: uniqueActiveChats,
      messages: scopedMessages.length,
      partner_network: connectedPartners,
      contracts: contractDocs.length,
      documents: scopedDocuments.length,
      factories: users.filter((u) => u.role === 'factory').length,
    },
    analytics_events: {
      total: scopedEvents.length,
      by_type: byType,
    },
    series: {
      buyer_requests: toMonthlySeries(scopedRequirements, 'created_at'),
      chats: toMonthlySeries(scopedMessages, 'timestamp'),
      documents: toMonthlySeries(scopedDocuments, 'created_at'),
    },
  }
}
