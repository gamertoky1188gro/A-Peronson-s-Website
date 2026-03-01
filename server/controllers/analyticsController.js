import { getAnalyticsSummary } from '../services/analyticsService.js'

export async function analyticsSummary(req, res) {
  const summary = await getAnalyticsSummary()
  return res.json(summary)
}
