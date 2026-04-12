import { getPlatformOverview, getPlatformTrends } from '../../server/services/analyticsService.js'

describe('analytics service smoke tests', () => {
  test('platform overview returns an object', async () => {
    const user = { id: 'owner-test', role: 'owner' }
    const res = await getPlatformOverview(user)
    expect(res).toBeDefined()
    expect(typeof res).toBe('object')
  })

  test('platform trends accepts dimensions and returns object', async () => {
    const user = { id: 'owner-test', role: 'owner' }
    const res = await getPlatformTrends(user, { dimensions: ['country', 'category'] })
    expect(res).toBeDefined()
    expect(typeof res).toBe('object')
  })
})
