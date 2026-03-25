import { createReport } from '../services/reportService.js'
import { sanitizeString } from '../utils/validators.js'

export async function createSupportReport(req, res) {
  const subject = sanitizeString(String(req.body?.subject || ''), 140)
  const description = sanitizeString(String(req.body?.description || ''), 1200)
  if (!subject || !description) {
    return res.status(400).json({ error: 'Subject and description are required' })
  }

  const metadata = {
    category: sanitizeString(String(req.body?.category || ''), 80),
    page_url: sanitizeString(String(req.body?.page_url || ''), 240),
    priority: sanitizeString(String(req.body?.priority || ''), 40),
    contact_email: sanitizeString(String(req.body?.contact_email || ''), 120),
  }

  const report = await createReport({
    actor: req.user,
    entity_type: 'support',
    entity_id: `support:${req.user?.id || 'anonymous'}`,
    reason: subject,
    metadata: {
      ...metadata,
      description,
    },
  })

  return res.status(201).json(report)
}
