import { getAnalyticsSummary, getDashboardAnalytics } from '../services/analyticsService.js'

function handleError(res, error) {
  const status = Number(error?.status) || 500
  if (status === 500) return res.status(500).json({ error: 'Internal server error' })
  return res.status(status).json({ error: error.message || 'Request failed' })
}

export async function analyticsSummary(req, res) {
  try {
    const summary = await getAnalyticsSummary(req.user)
    return res.json(summary)
  } catch (error) {
    return handleError(res, error)
  }
}

export async function analyticsDashboard(req, res) {
  try {
    const dashboard = await getDashboardAnalytics(req.user)
    return res.json(dashboard)
  } catch (error) {
    return handleError(res, error)
  }
}
