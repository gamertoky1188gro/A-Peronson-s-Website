import { getCrmProfileSummary } from '../services/crmService.js'
import { handleControllerError } from '../utils/permissions.js'

export async function crmProfileSummary(req, res) {
  try {
    const result = await getCrmProfileSummary(req.user, req.params.targetId)
    if (result?.error === 'forbidden') return res.status(403).json({ error: 'Forbidden' })
    if (result?.error) return res.status(404).json({ error: result.error })
    return res.json(result)
  } catch (error) {
    return handleControllerError(res, error)
  }
}
