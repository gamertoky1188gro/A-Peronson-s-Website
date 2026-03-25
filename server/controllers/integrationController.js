import { getIntegrationStatus, runIntegrationAction } from '../services/integrationStatusService.js'

export async function integrationStatusController(req, res) {
  const status = await getIntegrationStatus()
  return res.json(status)
}

export async function integrationActionController(req, res) {
  const action = String(req.body?.action || '').trim()
  const payload = req.body?.payload || {}
  const result = await runIntegrationAction(action, payload)
  return res.json(result)
}
