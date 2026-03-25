import { promises as fs } from 'fs'
import path from 'path'
import { listMatchesForFactory, listMatchesForRequirement } from '../services/matchingService.js'
import {
  acceptMessageRequest,
  canAccessMatch,
  listFriendMatchIdsForUser,
  listMessagesByMatch,
  markThreadRead,
  postFriendMessage,
  postMessage,
  rejectMessageRequest,
  tieredInbox,
} from '../services/messageService.js'
import { maybeGenerateBotReply } from '../services/chatbotService.js'
import { readJson } from '../utils/jsonStore.js'

export async function sendMessage(req, res) {
  const allowed = await canAccessMatch(req.params.matchId, req.user.id)
  if (!allowed) return res.status(403).json({ error: 'Only connected friends can message in this thread' })

  try {
    const msg = await postMessage(req.params.matchId, req.user.id, req.body?.message || '', req.body?.type || 'text')
    let botReply = null
    try {
      const result = await maybeGenerateBotReply({ match_id: req.params.matchId, sender_id: req.user.id, message: req.body?.message || '' })
      botReply = result?.reply || null
    } catch {
      botReply = null
    }
    return res.status(201).json({ ...msg, bot_reply: botReply })
  } catch (error) {
    return res.status(error.status || 400).json({
      error: error.message || 'Unable to send message',
      code: error.code || undefined,
      lock: error.lock || undefined,
    })
  }
}

export async function getMessages(req, res) {
  const allowed = await canAccessMatch(req.params.matchId, req.user.id)
  if (!allowed) return res.status(403).json({ error: 'Forbidden' })
  return res.json(await listMessagesByMatch(req.params.matchId))
}

export async function markRead(req, res) {
  const allowed = await canAccessMatch(req.params.matchId, req.user.id)
  if (!allowed) return res.status(403).json({ error: 'Forbidden' })
  try {
    const row = await markThreadRead(req.params.matchId, req.user.id)
    return res.json(row)
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message || 'Unable to mark as read' })
  }
}

export async function sendFriendDirectMessage(req, res) {
  const payloadMessage = String(req.body?.message || '').trim()
  const text = payloadMessage || 'Hi! We are connected now.'

  try {
    const result = await postFriendMessage(req.user.id, req.params.userId, text, req.body?.type || 'text')
    return res.status(201).json(result)
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message || 'Unable to send friend message' })
  }
}


export async function uploadMessageAttachment(req, res) {
  const file = req.file
  const matchId = String(req.params.matchId || '').trim()

  if (!file) return res.status(400).json({ error: 'File is required' })
  if (!matchId) return res.status(400).json({ error: 'matchId is required' })

  const allowed = await canAccessMatch(matchId, req.user.id)
  if (!allowed) {
    try {
      await fs.unlink(file.path)
    } catch {
      // ignore cleanup failure
    }
    return res.status(403).json({ error: 'Only connected friends can upload in this thread' })
  }

  const uploadBase = path.join(process.cwd(), 'server', 'uploads')
  const normalized = String(file.path || '').replace(/\\/g, '/')
  const relative = normalized.startsWith(uploadBase.replace(/\\/g, '/'))
    ? normalized.replace(uploadBase.replace(/\\/g, '/'), '')
    : normalized.replace(String(process.cwd()).replace(/\\/g, '/'), '')
  const publicUrl = `/uploads${relative.startsWith('/') ? relative : `/${relative}`}`

  const mime = String(file.mimetype || '')
  const messageType = mime.startsWith('image/') ? 'image' : (mime.startsWith('video/') ? 'video' : 'file')
  const fallbackText = messageType === 'image' ? 'Shared an image' : (messageType === 'video' ? 'Shared a video' : 'Shared a file')

  try {
    const created = await postMessage(matchId, req.user.id, req.body?.message || fallbackText, messageType, {
      name: file.originalname,
      url: publicUrl,
      mime_type: mime,
      size: file.size,
    })

    let botReply = null
    try {
      const result = await maybeGenerateBotReply({ match_id: matchId, sender_id: req.user.id, message: req.body?.message || fallbackText })
      botReply = result?.reply || null
    } catch {
      botReply = null
    }

    return res.status(201).json({ ...created, bot_reply: botReply })
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message || 'Unable to send message attachment' })
  }
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
  const friendMatchIds = await listFriendMatchIdsForUser(req.user.id)
  return res.json(await tieredInbox([...new Set([...matchIds, ...friendMatchIds])], req.user.id))
}

export async function acceptRequest(req, res) {
  const request = await acceptMessageRequest(req.params.threadId, req.user.id)
  return res.json({ ok: true, request })
}

export async function rejectRequest(req, res) {
  const request = await rejectMessageRequest(req.params.threadId, req.user.id)
  return res.json({ ok: true, request })
}
