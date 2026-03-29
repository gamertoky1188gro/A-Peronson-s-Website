import { getAnalyticsSummary, getCompanyAnalytics, getDashboardAnalytics, getPlatformAnalytics, getPremiumInsights } from '../services/analyticsService.js'
import { handleControllerError } from '../utils/permissions.js'
import { findUserById } from '../services/userService.js'

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
    // Agents need permission_matrix to be evaluated; token payload is minimal, so load the full user record.
    const actor = req.user?.role === 'agent' ? await findUserById(req.user.id) : req.user
    const dashboard = await getDashboardAnalytics(actor)
    return res.json(dashboard)
  } catch (error) {
    return handleError(res, error)
  }
}

export async function analyticsCompany(req, res) {
  try {
    const actor = req.user?.role === 'agent' ? await findUserById(req.user.id) : req.user
    const report = await getCompanyAnalytics(actor)
    return res.json(report)
  } catch (error) {
    return handleError(res, error)
  }
}

export async function analyticsPlatform(req, res) {
  try {
    const report = await getPlatformAnalytics(req.user)
    return res.json(report)
  } catch (error) {
    return handleError(res, error)
  }
}

export async function analyticsPremium(req, res) {
  try {
    const actor = req.user?.role === 'agent' ? await findUserById(req.user.id) : req.user
    const insights = await getPremiumInsights(actor)
    return res.json(insights)
  } catch (error) {
    return handleError(res, error)
  }
}
