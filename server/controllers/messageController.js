import { listMatchesForFactory, listMatchesForRequirement } from '../services/matchingService.js'
import {
  acceptMessageRequest,
  listMessagesByMatch,
  postMessage,
  rejectMessageRequest,
  tieredInbox,
} from '../services/messageService.js'
import { readJson } from '../utils/jsonStore.js'

export async function sendMessage(req, res) {
  const msg = await postMessage(req.params.matchId, req.user.id, req.body?.message || '', req.body?.type || 'text')
  return res.status(201).json(msg)
}

export async function getMessages(req, res) {
  return res.json(await listMessagesByMatch(req.params.matchId))
}

export async function inbox(req, res) {
  let matchIds = []
  if (req.user.role === 'factory') {
    const myMatches = await listMatchesForFactory(req.user.id)
    matchIds = myMatches.map((m) => `${m.requirement_id}:${m.factory_id}`)
  } else if (req.user.role === 'buyer') {
    const requirements = await readJson('requirements.json')
    const mine = requirements.filter((r) => r.buyer_id === req.user.id)
    const all = []
    for (const r of mine) {
      const mr = await listMatchesForRequirement(r.id)
      all.push(...mr.map((m) => `${m.requirement_id}:${m.factory_id}`))
    }
    matchIds = all
  }
  return res.json(await tieredInbox(matchIds))
}

export async function acceptRequest(req, res) {
  const request = await acceptMessageRequest(req.params.threadId, req.user.id)
  return res.json({ ok: true, request })
}

export async function rejectRequest(req, res) {
  const request = await rejectMessageRequest(req.params.threadId, req.user.id)
  return res.json({ ok: true, request })
}
