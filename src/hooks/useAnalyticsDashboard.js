import { useEffect, useMemo, useState } from 'react'
import { apiRequest, getToken } from '../lib/auth'

const ENTERPRISE_PLANS = new Set(['premium', 'enterprise'])

export default function useAnalyticsDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        setError('')
        const token = getToken()
        const [dashboardData, subscriptionData] = await Promise.all([
          apiRequest('/analytics/dashboard', { token }),
          apiRequest('/subscriptions/me', { token }),
        ])

        if (!alive) return
        setDashboard(dashboardData)
        setSubscription(subscriptionData)
      } catch (err) {
        if (!alive) return
        setError(err.message || 'Failed to load analytics data')
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

  return { dashboard, subscription, isEnterprise, loading, error }
}
