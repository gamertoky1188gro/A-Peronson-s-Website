import { getAnalyticsSummary, getDashboardAnalytics } from '../services/analyticsService.js'
import { handleControllerError } from '../utils/permissions.js'

function handleError(res, error) {
  return handleControllerError(res, error)
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
