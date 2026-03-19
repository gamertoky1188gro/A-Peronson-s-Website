import { useEffect, useMemo, useState } from 'react'
import { apiRequest, getToken } from '../lib/auth'

const ENTERPRISE_PLANS = new Set(['premium', 'enterprise'])

export default function useAnalyticsDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [companyAnalytics, setCompanyAnalytics] = useState(null)
  const [platformAnalytics, setPlatformAnalytics] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        setError('')
        setForbidden(false)
        const token = getToken()
        const [dashboardData, subscriptionData] = await Promise.all([
          apiRequest('/analytics/dashboard', { token }),
          apiRequest('/subscriptions/me', { token }),
        ])

        if (!alive) return
        setDashboard(dashboardData)
        setSubscription(subscriptionData)

        apiRequest('/analytics/company', { token })
          .then((data) => {
            if (!alive) return
            setCompanyAnalytics(data)
          })
          .catch(() => {
            if (!alive) return
            setCompanyAnalytics(null)
          })

        apiRequest('/analytics/platform', { token })
          .then((data) => {
            if (!alive) return
            setPlatformAnalytics(data)
          })
          .catch(() => {
            if (!alive) return
            setPlatformAnalytics(null)
          })
      } catch (err) {
        if (!alive) return
        setForbidden(err.status === 403)
        setError(err.status === 403 ? 'You do not have permission to view analytics for this organization.' : (err.message || 'Failed to load analytics data'))
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()

    return () => {
      alive = false
    }
  }, [])

  const isEnterprise = useMemo(() => ENTERPRISE_PLANS.has(subscription?.plan), [subscription?.plan])

  return { dashboard, companyAnalytics, platformAnalytics, subscription, isEnterprise, loading, error, forbidden }
}
