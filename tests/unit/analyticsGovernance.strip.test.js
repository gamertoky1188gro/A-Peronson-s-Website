import { sanitizePlatformAnalytics } from '../../server/services/analyticsGovernanceService.js'

describe('analytics governance - strip denied fields', () => {
  test('removes denied fields from report', () => {
    const raw = {
      actor_id: 'user123',
      totals: { buyer_requests: 5 },
      top_categories_global: [{ label: 'A', count: 5 }],
    }
    const config = { enabled: true, min_cohort_size: 2 }
    const out = sanitizePlatformAnalytics(raw, config)
    expect(out).toBeDefined()
    const json = JSON.stringify(out.report)
    expect(json).not.toContain('actor_id')
  })
})
