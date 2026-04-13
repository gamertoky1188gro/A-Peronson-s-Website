import { sanitizePlatformAnalytics, getAnalyticsGovernanceConfig } from '../../server/services/analyticsGovernanceService.js'

describe('analytics governance sanitization', () => {
  test('suppresses small buckets and injects noise', () => {
    const raw = {
      monthly_demand_trend: [{ month: '2026-03-01', count: 2 }, { month: '2026-03-01', count: 30 }],
      price_range_demand: [{ bucket: '0-5', count: 3 }, { bucket: '50+', count: 50 }],
      top_categories_global: [{ label: 'Shirts', count: 4 }, { label: 'Jackets', count: 25 }],
    }
    const config = { min_cohort_size: 10 }
    const out = sanitizePlatformAnalytics(raw, config)
    expect(out).toBeDefined()
    expect(out.report).toBeDefined()
    expect(out.suppression).toBeDefined()
    expect(typeof out.suppression.suppressed_values).toBe('number')
  })
})
