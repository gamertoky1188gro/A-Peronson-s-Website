    1 | import {
    2 |   createScheduledCallSession,
    3 |   endCallSession,
    4 |   findOrCreateCallSession,
    5 |   getCallSession,
    6 |   getRecordingMetadata,
    7 |   listCallHistory,
    8 |   listCallsByContract,
    9 |   markRecording,
   10 |   markRecordingViewed,
   11 |   startCallSession,
   12 | } from '../services/callSessionService.js'
   13 | import path from 'path'
   14 | import { buildIceServers } from '../services/webrtcService.js'
   15 | import { buildFriendMatchId, isFriendConnected } from '../services/friendService.js'
   16 | import { findUserById } from '../services/userService.js'
   17 | import { consumePendingInvites, enqueuePendingInvites } from '../utils/pendingInvites.js'
   18 | 
   19 | export async function createScheduledCall(req, res) {
   20 |   const call = await createScheduledCallSession(req.user.id, req.body)
   21 |   return res.status(201).json(call)
   22 | }
   23 | 
   24 | export async function startCall(req, res) {
   25 |   const result = await startCallSession(req.params.callId, req.user.id)
   26 |   if (!result) return res.status(404).json({ error: 'Call session not found' })
   27 |   if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   28 |   if (result === 'invalid_transition') return res.status(409).json({ error: 'Call cannot be started from current state' })
   29 |   return res.json(result)
   30 | }
   31 | 
   32 | export async function endCall(req, res) {
   33 |   const result = await endCallSession(req.params.callId, req.user.id, req.body?.reason)
   34 |   if (!result) return res.status(404).json({ error: 'Call session not found' })
   35 |   if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   36 |   if (result === 'invalid_transition') return res.status(409).json({ error: 'Call cannot be ended from current state' })
   37 |   return res.json(result)
   38 | }
   39 | 
   40 | export async function updateRecording(req, res) {
   41 |   const requestedStatus = String(req.body?.recording_status || '').trim()
   42 |   const validStatuses = new Set(['processing', 'available', 'failed'])
   43 | 
   44 |   if (!requestedStatus || !validStatuses.has(requestedStatus)) {
   45 |     return res.status(400).json({ error: 'Invalid recording_status. Use processing, available, or failed.' })
   46 |   }
   47 | 
   48 |   if (requestedStatus === 'available' && !String(req.body?.recording_url || '').trim()) {
   49 |     return res.status(400).json({ error: 'recording_url is required when recording_status is available' })
   50 |   }
   51 | 
   52 |   if (requestedStatus === 'failed' && !String(req.body?.failure_reason || '').trim()) {
   53 |     return res.status(400).json({ error: 'failure_reason is required when recording_status is failed' })
   54 |   }
   55 | 
   56 |   const call = await getCallSession(req.params.callId, req.user.id)
   57 |   if (!call) return res.status(404).json({ error: 'Call session not found' })
   58 |   if (call === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   59 | 
   60 |   const currentRecordingStatus = String(call.recording_status || 'pending').trim()
   61 |   const allowedTransitions = {
   62 |     pending: new Set(['processing']),
   63 |     processing: new Set(['available', 'failed']),
   64 |     available: new Set(),
   65 |     failed: new Set(),
   66 |   }
   67 | 
   68 |   if (!allowedTransitions[currentRecordingStatus]?.has(requestedStatus)) {
   69 |     return res.status(409).json({
   70 |       error: `Invalid recording status transition from ${currentRecordingStatus} to ${requestedStatus}`,
   71 |     })
   72 |   }
   73 | 
   74 |   const result = await markRecording(req.params.callId, req.user.id, req.body)
   75 |   if (!result) return res.status(404).json({ error: 'Call session not found' })
   76 |   if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   77 |   if (result === 'invalid_transition') return res.status(409).json({ error: 'Invalid recording status transition for this call' })
   78 |   if (result === 'missing_metadata') return res.status(400).json({ error: 'recording_url is required when recording_status is available' })
   79 |   if (result === 'missing_failure_reason') return res.status(400).json({ error: 'failure_reason is required when recording_status is failed' })
   80 |   return res.json(result)
   81 | }
   82 | 
   83 | export async function getCall(req, res) {
   84 |   const result = await getCallSession(req.params.callId, req.user.id)
   85 |   if (!result) return res.status(404).json({ error: 'Call session not found' })
   86 |   if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   87 |   return res.json(result)
   88 | }
   89 | 
   90 | export async function uploadRecordingFile(req, res) {
   91 |   const file = req.file
   92 |   if (!file) return res.status(400).json({ error: 'File is required' })
   93 | 
   94 |   const allowedMimes = new Set(['video/webm', 'video/mp4', 'audio/webm', 'audio/ogg', 'video/ogg'])
   95 |   const mime = String(file.mimetype || '').toLowerCase()
   96 |   if (mime && !allowedMimes.has(mime)) {
   97 |     return res.status(400).json({ error: 'Unsupported recording file type' })
   98 |   }
   99 | 
  100 |   const callId = req.params.callId
  101 |   const call = await getCallSession(callId, req.user.id)
  102 |   if (!call) return res.status(404).json({ error: 'Call session not found' })
  103 |   if (call === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  104 | 
  105 |   const fileName = path.basename(String(file.path || '')).replace(/\\/g, '/')
  106 |   const publicUrl = fileName ? `/uploads/calls/${fileName}` : ''
  107 |   if (!publicUrl) return res.status(500).json({ error: 'Recording upload failed' })
  108 | 
  109 |   // If the call never transitioned to processing, do it now so we can mark it available.
  110 |   if (String(call.recording_status || 'pending') === 'pending') {
  111 |     await markRecording(callId, req.user.id, { recording_status: 'processing' })
  112 |   }
  113 | 
  114 |   const updated = await markRecording(callId, req.user.id, {
  115 |     recording_status: 'available',
  116 |     recording_url: publicUrl,
  117 |   })
  118 | 
  119 |   if (updated === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  120 |   if (updated === 'invalid_transition') return res.status(409).json({ error: 'Invalid recording status transition for this call' })
  121 |   if (updated === 'missing_metadata') return res.status(400).json({ error: 'recording_url is required when recording_status is available' })
  122 | 
  123 |   return res.status(201).json(updated)
  124 | }
  125 | 
  126 | export async function getCallIceServers(req, res) {
  127 |   const result = await getCallSession(req.params.callId, req.user.id)
  128 |   if (!result) return res.status(404).json({ error: 'Call session not found' })
  129 |   if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  130 | 
  131 |   const iceServers = buildIceServers({ userId: req.user.id })
  132 |   return res.json({ iceServers })
  133 | }
  134 | 
  135 | export async function getCallHistory(req, res) {
  136 |   const matchIds = req.query.match_ids
  137 |     ? String(req.query.match_ids)
  138 |       .split(',')
  139 |       .map((id) => id.trim())
  140 |       .filter(Boolean)
  141 |     : []
  142 | 
  143 |   const history = await listCallHistory(matchIds, req.user.id)
  144 |   return res.json({ items: history })
  145 | }
  146 | 
  147 | export async function getCallsByContract(req, res) {
  148 |   const items = await listCallsByContract(req.params.contractId, req.user.id)
  149 |   return res.json({ items })
  150 | }
  151 | 
  152 | export async function getRecording(req, res) {
  153 |   const meta = await getRecordingMetadata(req.params.callId, req.user.id)
  154 |   if (!meta) return res.status(404).json({ error: 'Call session not found' })
  155 |   if (meta === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  156 |   return res.json(meta)
  157 | }
  158 | 
  159 | export async function markRecordingViewedController(req, res) {
  160 |   const result = await markRecordingViewed(req.params.callId, req.user.id)
  161 |   if (!result) return res.status(404).json({ error: 'Call session not found' })
  162 |   if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
  163 |   return res.json(result)
  164 | }
  165 | 
  166 | export async function getPendingInvites(req, res) {
  167 |   const invites = consumePendingInvites(req.user.id)
  168 |   return res.json({ invites })
  169 | }
  170 | 
  171 | export async function joinOrCreateCall(req, res) {
  172 |   const result = await findOrCreateCallSession(req.user.id, req.body || {})
  173 |   const call = result?.call || null
  174 |   if (call?.id && Array.isArray(call.participant_ids)) {
  175 |     const caller = await findUserById(req.user.id)
  176 |     const from = caller ? {
  177 |       id: caller.id,
  178 |       name: caller.name || '',
  179 |       email: caller.email || req.user.email || '',
  180 |       avatar: caller.avatar_url || caller.avatar || '',
  181 |       role: caller.role || req.user.role || '',
  182 |       verified: Boolean(caller.verified),
  183 |     } : {
  184 |       id: req.user.id,
  185 |       name: '',
  186 |       email: req.user.email || '',
  187 |       avatar: '',
  188 |       role: req.user.role || '',
  189 |       verified: false,
  190 |     }
  191 | 
  192 |     const targets = [...new Set(call.participant_ids)].filter((id) => id && id !== req.user.id)
  193 |     if (targets.length > 0) {
  194 |       enqueuePendingInvites(targets, [{
  195 |         type: 'incoming_call',
  196 |         call_id: call.id,
  197 |         match_id: call.match_id || '',
  198 |         from,
  199 |       }])
  200 |     }
  201 |   }
  202 |   return res.status(result.created ? 201 : 200).json(result)
  203 | }
  204 | 
  205 | 
  206 | export async function joinFriendCall(req, res) {
  207 |   const targetId = String(req.params.userId || '').trim()
  208 |   if (!targetId || targetId === req.user.id) {
  209 |     return res.status(400).json({ error: 'Invalid friend target' })
  210 |   }
  211 | 
  212 |   const connected = await isFriendConnected(req.user.id, targetId)
  213 |   if (!connected) {
  214 |     return res.status(403).json({ error: 'Only friends can start direct calls' })
  215 |   }
  216 | 
  217 |   const matchId = buildFriendMatchId(req.user.id, targetId)
  218 |   const result = await findOrCreateCallSession(req.user.id, {
  219 |     match_id: matchId,
  220 |     chat_thread_id: matchId,
  221 |     participant_ids: [targetId],
  222 |     title: 'Friend call',
  223 |   })
  224 | 
  225 |   const call = result?.call || null
  226 |   if (call?.id) {
  227 |     const caller = await findUserById(req.user.id)
  228 |     const from = caller ? {
  229 |       id: caller.id,
  230 |       name: caller.name || '',
  231 |       email: caller.email || req.user.email || '',
  232 |       avatar: caller.avatar_url || caller.avatar || '',
  233 |       role: caller.role || req.user.role || '',
  234 |       verified: Boolean(caller.verified),
  235 |     } : {
  236 |       id: req.user.id,
  237 |       name: '',
  238 |       email: req.user.email || '',
  239 |       avatar: '',
  240 |       role: req.user.role || '',
  241 |       verified: false,
  242 |     }
  243 | 
  244 |     enqueuePendingInvites([targetId], [{
  245 |       type: 'incoming_call',
  246 |       call_id: call.id,
  247 |       match_id: call.match_id || matchId,
  248 |       from,
  249 |     }])
  250 |   }
  251 | 
  252 |   return res.status(result.created ? 201 : 200).json(result)
  253 | }
  254 | 