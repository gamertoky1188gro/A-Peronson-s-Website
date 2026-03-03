import { getAnalyticsSummary, getDashboardAnalytics } from '../services/analyticsService.js'

export async function analyticsSummary(req, res) {
  const summary = await getAnalyticsSummary()
  return res.json(summary)
}

export async function analyticsDashboard(req, res) {
  const dashboard = await getDashboardAnalytics()
  return res.json(dashboard)
}
