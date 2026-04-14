    1 | import { getChatbotProfileSummary, getChatbotSettings, maybeGenerateBotReply, updateChatbotSettings } from '../services/chatbotService.js'
    2 | import { ensureEntitlement } from '../services/entitlementService.js'
    3 | 
    4 | export async function getChatbotProfile(req, res) {
    5 |   const summary = await getChatbotProfileSummary(req.params.userId)
    6 |   if (!summary) return res.status(404).json({ error: 'User not found' })
    7 |   return res.json({ ok: true, profile: summary })
    8 | }
    9 | 
   10 | export async function replyWithChatbot(req, res) {
   11 |   const match_id = req.body?.match_id || req.body?.threadId || req.body?.thread_id || ''
   12 |   const message = req.body?.message || req.body?.text || ''
   13 |   const result = await maybeGenerateBotReply({
   14 |     match_id,
   15 |     sender_id: req.user?.id,
   16 |     message,
   17 |   })
   18 |   return res.json({ ok: true, ...result })
   19 | }
   20 | 
   21 | export async function getChatbotSettingsController(req, res) {
   22 |   await ensureEntitlement(req.user, 'ai_auto_reply_customization', 'Premium plan required for AI auto-reply customization.')
   23 |   const settings = await getChatbotSettings(req.user?.id)
   24 |   if (!settings) return res.status(404).json({ error: 'User not found' })
   25 |   return res.json({ ok: true, settings })
   26 | }
   27 | 
   28 | export async function updateChatbotSettingsController(req, res) {
   29 |   await ensureEntitlement(req.user, 'ai_auto_reply_customization', 'Premium plan required for AI auto-reply customization.')
   30 |   const settings = await updateChatbotSettings(req.user?.id, req.body || {})
   31 |   if (!settings) return res.status(404).json({ error: 'User not found' })
   32 |   return res.json({ ok: true, settings })
   33 | }
   34 | 