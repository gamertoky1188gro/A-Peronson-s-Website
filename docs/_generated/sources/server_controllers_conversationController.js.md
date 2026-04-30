    1 | import { claimConversation, grantConversationAccess, requestConversationAccess, transferConversation } from '../services/conversationLockService.js'
    2 | 
    3 | export async function claim(req, res) {
    4 |   const result = await claimConversation(req.params.requestId, req.user)
    5 |   if (result.status === 'locked') return res.status(409).json(result)
    6 |   return res.json(result)
    7 | }
    8 | 
    9 | export async function grant(req, res) {
   10 |   const targetId = req.body?.target_user_id || req.body?.target_agent_id
   11 |   const result = await grantConversationAccess(req.params.requestId, req.user, targetId)
   12 |   if (result === 'invalid_target') return res.status(400).json({ error: 'target_user_id is required' })
   13 |   if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   14 |   if (!result) return res.status(404).json({ error: 'Lock not found' })
   15 |   return res.json(result)
   16 | }
   17 | 
   18 | export async function requestAccess(req, res) {
   19 |   const result = await requestConversationAccess(req.params.requestId, req.user)
   20 |   if (!result) return res.status(404).json({ error: 'Conversation not found' })
   21 |   return res.json(result)
   22 | }
   23 | 
   24 | export async function transfer(req, res) {
   25 |   const targetId = req.body?.target_user_id || req.body?.target_agent_id
   26 |   const result = await transferConversation(req.params.requestId, req.user, targetId)
   27 |   if (result === 'invalid_target') return res.status(400).json({ error: 'target_user_id is required' })
   28 |   if (result === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
   29 |   if (!result) return res.status(404).json({ error: 'Lock not found' })
   30 |   return res.json(result)
   31 | }
   32 | 