import { getChatbotProfileSummary, maybeGenerateBotReply } from '../services/chatbotService.js'

export async function getChatbotProfile(req, res) {
  const summary = await getChatbotProfileSummary(req.params.userId)
  if (!summary) return res.status(404).json({ error: 'User not found' })
  return res.json({ ok: true, profile: summary })
}

export async function replyWithChatbot(req, res) {
  const match_id = req.body?.match_id || req.body?.threadId || req.body?.thread_id || ''
  const message = req.body?.message || req.body?.text || ''
  const result = await maybeGenerateBotReply({
    match_id,
    sender_id: req.user?.id,
    message,
  })
  return res.json({ ok: true, ...result })
}

