import crypto from 'crypto'
import { readJson, updateJson } from '../utils/jsonStore.js'
import { findUserById, listUsers } from './userService.js'
import { recordMilestone } from './ratingsService.js'
import { createNotification } from './notificationService.js'
import { getAdminConfig } from './adminConfigService.js'
import { getPlanForUser } from './entitlementService.js'
import {
  canManagePartnerNetwork,
  canViewPartnerNetwork,
  canRespondToPartnerRequest,
  isAgent,
  isOwnerOrAdmin,
  scopeRecordsForUser,
} from '../utils/permissions.js'

const FILE = 'partner_requests.json'
const ACTIVE_STATUSES = new Set(['pending', 'connected'])

async function isPremium(user) {
  const plan = await getPlanForUser(user)
  return plan === 'premium'
}

function isAllowedPair(fromRole, toRole) {
  return (fromRole === 'factory' && toRole === 'buying_house') || (fromRole === 'buying_house' && toRole === 'factory')
}

function mapWithCounterparty(request, me, usersById) {
  const counterpartyId = request.requester_id === me.id ? request.target_id : request.requester_id
  const counterparty = usersById.get(counterpartyId)
  return {
    ...request,
    direction: request.requester_id === me.id ? 'outgoing' : 'incoming',
    counterparty: counterparty
      ? { id: counterparty.id, name: counterparty.name, role: counterparty.role, verified: Boolean(counterparty.verified) }
      : { id: counterpartyId, name: 'Unknown account', role: 'unknown', verified: false },
  }
}

export async function getPartnerNetwork(user, { status } = {}) {
  if (!canViewPartnerNetwork(user)) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }

  const [requests, users] = await Promise.all([readJson(FILE), listUsers()])
  const usersById = new Map(users.map((u) => [u.id, u]))

  const scoped = scopeRecordsForUser(user, requests, {
    idFields: ['requester_id', 'target_id'],
    assignmentFields: ['assigned_agent_id', 'agent_id'],
  })

  const filtered = status ? scoped.filter((r) => r.status === status) : scoped
  const rows = filtered.map((r) => mapWithCounterparty(r, user, usersById)).sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
  const connectedFactories = rows
    .filter((r) => r.status === 'connected' && r.counterparty?.role === 'factory')
    .map((r) => r.counterparty)

  return {
    requests: rows,
    connected_factories: connectedFactories,
    permissions: {
      view_only: isAgent(user),
      can_manage: canManagePartnerNetwork(user),
    },
  }
}

export async function sendPartnerRequest(user, targetAccountId) {
  if (!canManagePartnerNetwork(user)) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }

  const target = await findUserById(targetAccountId)
  if (!target) {
    const err = new Error('Target account not found')
    err.status = 404
    throw err
  }

  if (target.id === user.id) {
    const err = new Error('Cannot request your own account')
    err.status = 400
    throw err
  }

  if (!isAllowedPair(user.role, target.role)) {
    const err = new Error('Partner requests only allowed between factory and buying house accounts')
    err.status = 400
    throw err
  }

  const now = new Date().toISOString()
  const id = crypto.randomUUID()
  const config = await getAdminConfig()
  const freePartnerLimit = Number(config?.plan_limits?.free?.partner_limit || 5)

  const created = await updateJson(FILE, (rows) => {
  const duplicate = rows.find((r) =>
      ((r.requester_id === user.id && r.target_id === target.id) || (r.requester_id === target.id && r.target_id === user.id))
      && (r.status === 'pending' || r.status === 'connected'))
    if (duplicate) {
      const err = new Error('An active partner relationship/request already exists between these accounts')
      err.status = 409
      throw err
    }

    if (user.role === 'buying_house' && !(await isPremium(user))) {
      const outgoing = rows.filter((r) => r.requester_id === user.id && ACTIVE_STATUSES.has(r.status))
      if (outgoing.length >= freePartnerLimit) {
        const err = new Error(`Upgrade to premium to send more than ${freePartnerLimit} partner requests.`)
        err.status = 403
        throw err
      }
    }

    const row = {
      id,
      requester_id: user.id,
      requester_role: user.role,
      target_id: target.id,
      target_role: target.role,
      status: 'pending',
      created_at: now,
      updated_at: now,
    }
    rows.push(row)
    return rows
  })

  const row = created.find((r) => r.id === id)
  if (row) {
    // Notify the target factory so they can accept/reject from /notifications.
    await createNotification(target.id, {
      type: 'partner_request',
      entity_type: 'partner_request',
      entity_id: row.id,
      message: `New partner request from ${user.name}`,
      meta: {
        request_id: row.id,
        requester_id: user.id,
        requester_role: user.role,
      },
    })
  }

  return row
}

export async function updatePartnerRequestStatus(user, requestId, action) {
  // Accept/reject is allowed for factories (targets) and owner/admin. Cancel is allowed for buying house requester and owner/admin.
  const isAdmin = isOwnerOrAdmin(user)
  const isFactory = canRespondToPartnerRequest(user) && !isAdmin && String(user?.role || '').toLowerCase() === 'factory'
  const canCancel = isAdmin || String(user?.role || '').toLowerCase() === 'buying_house'
  if (!isAdmin && !isFactory && !canCancel) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }

  if (!['accept', 'reject', 'cancel'].includes(action)) {
      const err = new Error('Invalid action')
      err.status = 400
      throw err
    }

  const config = await getAdminConfig()
  const freePartnerLimit = Number(config?.plan_limits?.free?.partner_limit || 5)

  let updatedRow = null
  const nextStatus = action === 'accept' ? 'connected' : action === 'reject' ? 'rejected' : 'cancelled'

  await updateJson(FILE, (rows) => {
    const index = rows.findIndex((r) => r.id === requestId)
    if (index < 0) {
      const err = new Error('Request not found')
      err.status = 404
      throw err
    }

    const current = rows[index]
    if (current.status !== 'pending') {
      const err = new Error('Only pending requests can be updated')
      err.status = 400
      throw err
    }

    if (action === 'accept' && String(user.role || '').toLowerCase() === 'factory' && !(await isPremium(user))) {
      const existingConnections = rows.filter((r) => r.target_id === user.id && r.status === 'connected').length
      if (existingConnections >= freePartnerLimit) {
        const err = new Error(`Subscribe to premium to accept more than ${freePartnerLimit} partner requests.`)
        err.status = 403
        throw err
      }
    }

    if (!isAdmin) {
      if (action === 'cancel' && current.requester_id !== user.id) {
        const err = new Error('Only requester can cancel this request')
        err.status = 403
        throw err
      }
      if ((action === 'accept' || action === 'reject') && current.target_id !== user.id) {
        const err = new Error('Only target account can accept/reject this request')
        err.status = 403
        throw err
      }
    }

    const now = new Date().toISOString()
    const next = { ...current, status: nextStatus, updated_at: now }
    rows[index] = next
    updatedRow = next
    return rows
  })

  if (updatedRow && nextStatus === 'connected') {
    // Notify the requester that the factory accepted the connection.
    await createNotification(updatedRow.requester_id, {
      type: 'partner_request',
      entity_type: 'partner_request',
      entity_id: updatedRow.id,
      message: 'Partner request accepted',
      meta: {
        request_id: updatedRow.id,
        target_id: updatedRow.target_id,
      },
    })
    await Promise.all([
      recordMilestone({
        profileKey: `user:${updatedRow.requester_id}`,
        counterpartyId: updatedRow.target_id,
        interactionType: 'contract',
        milestone: 'contract_signed',
        actorId: user.id,
      }),
      recordMilestone({
        profileKey: `user:${updatedRow.target_id}`,
        counterpartyId: updatedRow.requester_id,
        interactionType: 'contract',
        milestone: 'contract_signed',
        actorId: user.id,
      }),
    ])
  }

  return updatedRow
}

export async function enforcePartnerFreeTierLimits() {
  const [requests, users, config] = await Promise.all([readJson(FILE), listUsers(), getAdminConfig()])
  const rows = Array.isArray(requests) ? requests : []
  const usersById = new Map(users.map((u) => [String(u.id), u]))
  const freePartnerLimit = Number(config?.plan_limits?.free?.partner_limit || 5)

  const activeByUser = rows.reduce((acc, row) => {
    if (row.status !== 'connected') return acc
    const requester = String(row.requester_id)
    const target = String(row.target_id)
    acc[requester] = acc[requester] || []
    acc[target] = acc[target] || []
    acc[requester].push(row)
    acc[target].push(row)
    return acc
  }, {})

  let updated = false
  const now = new Date().toISOString()
  const next = rows.map((row) => {
    if (row.status !== 'connected') return row
    const requester = usersById.get(String(row.requester_id))
    const target = usersById.get(String(row.target_id))
    const requesterFree = requester && !isPremium(requester)
    const targetFree = target && !isPremium(target)
    const requesterActive = activeByUser[String(row.requester_id)] || []
    const targetActive = activeByUser[String(row.target_id)] || []
    const requesterOver = requesterFree && requesterActive.length > freePartnerLimit
    const targetOver = targetFree && targetActive.length > freePartnerLimit
    if (requesterOver || targetOver) {
      updated = true
      return { ...row, limit_exceeded: true, enforced_at: now }
    }
    return row.limit_exceeded ? { ...row, limit_exceeded: false, enforced_at: now } : row
  })

  if (updated) {
    await updateJson(FILE, () => next)
  }

  return { updated, limit: freePartnerLimit }
}
