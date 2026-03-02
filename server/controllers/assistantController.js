import { assistantReply } from '../services/assistantService.js'

export async function askAssistant(req, res) {
  return res.json(assistantReply(req.body?.question || ''))
}
