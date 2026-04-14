    1 | import { promises as fs } from 'fs'
    2 | import path from 'path'
    3 | import { listMatchesForFactory, listMatchesForRequirement } from '../services/matchingService.js'
    4 | import {
    5 |   acceptMessageRequest,
    6 |   canAccessMatch,
    7 |   listFriendMatchIdsForUser,
    8 |   listMessagesByMatch,
    9 |   markThreadRead,
   10 |   postFriendMessage,
   11 |   postMessage,
   12 |   rejectMessageRequest,
   13 |   tieredInbox,
   14 | } from '../services/messageService.js'
   15 | import { maybeGenerateBotReply } from '../services/chatbotService.js'
   16 | import {
   17 |   adjustSenderReputation,
   18 |   getCommunicationPolicyConfig,
   19 |   getWeeklyDecisionQualityReport,
   20 |   listMessageQueueItems,
   21 |   listPolicyFalsePositiveCandidates,
   22 |   markPolicyDecisionFalsePositive,
   23 |   upsertCommunicationPolicyConfig,
   24 | } from '../services/communicationPolicyService.js'
   25 | import { readJson } from '../utils/jsonStore.js'
   26 | 
   27 | export async function sendMessage(req, res) {
   28 |   const allowed = await canAccessMatch(req.params.matchId, req.user.id)
   29 |   if (!allowed) return res.status(403).json({ error: 'Only connected friends can message in this thread' })
   30 | 
   31 |   try {
   32 |     const msg = await postMessage(
   33 |       req.params.matchId,
   34 |       req.user.id,
   35 |       req.body?.message || '',
   36 |       req.body?.type || 'text',
   37 |       null,
   38 |       {
   39 |         source_type: req.body?.source_type,
   40 |         source_id: req.body?.source_id,
   41 |         source_label: req.body?.source_label,
   42 |       },
   43 |     )
   44 |     let botReply = null
   45 |     try {
   46 |       const result = await maybeGenerateBotReply({ match_id: req.params.matchId, sender_id: req.user.id, message: req.body?.message || '' })
   47 |       botReply = result?.reply || null
   48 |     } catch {
   49 |       botReply = null
   50 |     }
   51 |     return res.status(201).json({ ...msg, bot_reply: botReply })
   52 |   } catch (error) {
   53 |     return res.status(error.status || 400).json({
   54 |       error: error.message || 'Unable to send message',
   55 |       code: error.code || undefined,
   56 |       lock: error.lock || undefined,
   57 |       reason: error?.policy?.reason || undefined,
   58 |       retry_after_seconds: Number(error?.policy?.retry_after_seconds || 0) || undefined,
   59 |       policy: error?.policy || undefined,
   60 |     })
   61 |   }
   62 | }
   63 | 
   64 | export async function getMessages(req, res) {
   65 |   const allowed = await canAccessMatch(req.params.matchId, req.user.id)
   66 |   if (!allowed) return res.status(403).json({ error: 'Forbidden' })
   67 |   return res.json(await listMessagesByMatch(req.params.matchId))
   68 | }
   69 | 
   70 | export async function markRead(req, res) {
   71 |   const allowed = await canAccessMatch(req.params.matchId, req.user.id)
   72 |   if (!allowed) return res.status(403).json({ error: 'Forbidden' })
   73 |   try {
   74 |     const row = await markThreadRead(req.params.matchId, req.user.id)
   75 |     return res.json(row)
   76 |   } catch (error) {
   77 |     return res.status(error.status || 400).json({ error: error.message || 'Unable to mark as read' })
   78 |   }
   79 | }
   80 | 
   81 | export async function sendFriendDirectMessage(req, res) {
   82 |   const payloadMessage = String(req.body?.message || '').trim()
   83 |   const text = payloadMessage || 'Hi! We are connected now.'
   84 | 
   85 |   try {
   86 |     const result = await postFriendMessage(req.user.id, req.params.userId, text, req.body?.type || 'text')
   87 |     return res.status(201).json(result)
   88 |   } catch (error) {
   89 |     return res.status(error.status || 400).json({ error: error.message || 'Unable to send friend message' })
   90 |   }
   91 | }
   92 | 
   93 | 
   94 | export async function uploadMessageAttachment(req, res) {
   95 |   const file = req.file
   96 |   const matchId = String(req.params.matchId || '').trim()
   97 | 
   98 |   if (!file) return res.status(400).json({ error: 'File is required' })
   99 |   if (!matchId) return res.status(400).json({ error: 'matchId is required' })
  100 | 
  101 |   const allowed = await canAccessMatch(matchId, req.user.id)
  102 |   if (!allowed) {
  103 |     try {
  104 |       await fs.unlink(file.path)
  105 |     } catch {
  106 |       // ignore cleanup failure
  107 |     }
  108 |     return res.status(403).json({ error: 'Only connected friends can upload in this thread' })
  109 |   }
  110 | 
  111 |   const uploadBase = path.join(process.cwd(), 'server', 'uploads')
  112 |   const normalized = String(file.path || '').replace(/\\/g, '/')
  113 |   const relative = normalized.startsWith(uploadBase.replace(/\\/g, '/'))
  114 |     ? normalized.replace(uploadBase.replace(/\\/g, '/'), '')
  115 |     : normalized.replace(String(process.cwd()).replace(/\\/g, '/'), '')
  116 |   const publicUrl = `/uploads${relative.startsWith('/') ? relative : `/${relative}`}`
  117 | 
  118 |   const mime = String(file.mimetype || '')
  119 |   const messageType = mime.startsWith('image/') ? 'image' : (mime.startsWith('video/') ? 'video' : 'file')
  120 |   const fallbackText = messageType === 'image' ? 'Shared an image' : (messageType === 'video' ? 'Shared a video' : 'Shared a file')
  121 | 
  122 |   try {
  123 |     const created = await postMessage(matchId, req.user.id, req.body?.message || fallbackText, messageType, {
  124 |       name: file.originalname,
  125 |       url: publicUrl,
  126 |       mime_type: mime,
  127 |       size: file.size,
  128 |     }, {
  129 |       source_type: req.body?.source_type,
  130 |       source_id: req.body?.source_id,
  131 |       source_label: req.body?.source_label,
  132 |     })
  133 | 
  134 |     let botReply = null
  135 |     try {
  136 |       const result = await maybeGenerateBotReply({ match_id: matchId, sender_id: req.user.id, message: req.body?.message || fallbackText })
  137 |       botReply = result?.reply || null
  138 |     } catch {
  139 |       botReply = null
  140 |     }
  141 | 
  142 |     return res.status(201).json({ ...created, bot_reply: botReply })
  143 |   } catch (error) {
  144 |     return res.status(error.status || 400).json({
  145 |       error: error.message || 'Unable to send message attachment',
  146 |       reason: error?.policy?.reason || undefined,
  147 |       retry_after_seconds: Number(error?.policy?.retry_after_seconds || 0) || undefined,
  148 |       policy: error?.policy || undefined,
  149 |     })
  150 |   }
  151 | }
  152 | 
  153 | export async function inbox(req, res) {
  154 |   let matchIds = []
  155 |   if (req.user.role === 'factory') {
  156 |     const myMatches = await listMatchesForFactory(req.user.id)
  157 |     matchIds = myMatches.map((m) => `${m.requirement_id}:${m.factory_id}`)
  158 |   } else if (req.user.role === 'buyer') {
  159 |     const requirements = await readJson('requirements.json')
  160 |     const mine = requirements.filter((r) => r.buyer_id === req.user.id)
  161 |     const all = []
  162 |     for (const r of mine) {
  163 |       const mr = await listMatchesForRequirement(r.id)
  164 |       all.push(...mr.map((m) => `${m.requirement_id}:${m.factory_id}`))
  165 |     }
  166 |     matchIds = all
  167 |   }
  168 |   const friendMatchIds = await listFriendMatchIdsForUser(req.user.id)
  169 |   return res.json(await tieredInbox([...new Set([...matchIds, ...friendMatchIds])], req.user.id))
  170 | }
  171 | 
  172 | export async function acceptRequest(req, res) {
  173 |   const request = await acceptMessageRequest(req.params.threadId, req.user.id)
  174 |   return res.json({ ok: true, request })
  175 | }
  176 | 
  177 | export async function rejectRequest(req, res) {
  178 |   const request = await rejectMessageRequest(req.params.threadId, req.user.id)
  179 |   return res.json({ ok: true, request })
  180 | }
  181 | 
  182 | 
  183 | 
  184 | export async function getPolicyConfig(req, res) {
  185 |   const role = String(req.user?.role || '').toLowerCase()
  186 |   if (!['admin', 'owner', 'buying_house', 'factory'].includes(role)) return res.status(403).json({ error: 'Only org managers can access communication policy config' })
  187 | 
  188 |   const orgId = String(req.query?.org_id || req.user?.org_owner_id || req.user?.id || '')
  189 |   const config = await getCommunicationPolicyConfig({ org_id: orgId })
  190 |   return res.json({ config })
  191 | }
  192 | 
  193 | export async function updatePolicyConfig(req, res) {
  194 |   const role = String(req.user?.role || '').toLowerCase()
  195 |   if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can update communication policy config' })
  196 | 
  197 |   try {
  198 |     const updated = await upsertCommunicationPolicyConfig({
  199 |       scope: req.body?.scope || 'global',
  200 |       org_id: req.body?.org_id || null,
  201 |       config: req.body?.config || {},
  202 |       actor_id: req.user?.id || '',
  203 |     })
  204 |     return res.json({ ok: true, config: updated })
  205 |   } catch (error) {
  206 |     return res.status(error.status || 400).json({ error: error.message || 'Unable to update policy config' })
  207 |   }
  208 | }
  209 | 
  210 | export async function listPolicyReviewQueue(req, res) {
  211 |   const role = String(req.user?.role || '').toLowerCase()
  212 |   if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can access policy review queue' })
  213 | 
  214 |   const rows = await listPolicyFalsePositiveCandidates()
  215 |   return res.json({ rows })
  216 | }
  217 | 
  218 | export async function markPolicyFalsePositive(req, res) {
  219 |   const role = String(req.user?.role || '').toLowerCase()
  220 |   if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can mark false positives' })
  221 | 
  222 |   const updated = await markPolicyDecisionFalsePositive(req.params.decisionId, req.user.id, req.body?.notes || '')
  223 |   if (!updated) return res.status(404).json({ error: 'Decision not found' })
  224 |   return res.json({ ok: true, decision: updated })
  225 | }
  226 | 
  227 | 
  228 | export async function listMessagePolicyQueueInspector(req, res) {
  229 |   const role = String(req.user?.role || '').toLowerCase()
  230 |   if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can access policy queue inspector' })
  231 | 
  232 |   const rows = await listMessageQueueItems({ status: req.query?.status || '' })
  233 |   return res.json({ rows })
  234 | }
  235 | 
  236 | export async function updateSenderReputation(req, res) {
  237 |   const role = String(req.user?.role || '').toLowerCase()
  238 |   if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can adjust sender reputation' })
  239 | 
  240 |   const delta = Number(req.body?.delta || 0)
  241 |   const updated = await adjustSenderReputation(req.params.senderId, delta, req.user?.id || '', req.body?.notes || '')
  242 |   if (!updated) return res.status(404).json({ error: 'Sender not found' })
  243 |   return res.json({ ok: true, reputation: updated })
  244 | }
  245 | 
  246 | export async function weeklyPolicyDecisionQualityReport(req, res) {
  247 |   const role = String(req.user?.role || '').toLowerCase()
  248 |   if (!['admin', 'owner'].includes(role)) return res.status(403).json({ error: 'Only admins can access policy quality reports' })
  249 | 
  250 |   const report = await getWeeklyDecisionQualityReport()
  251 |   return res.json(report)
  252 | }
  253 | 