import { jest } from '@jest/globals'
import { requireAuth, signToken } from '../../server/middleware/auth.js'
import { requireEntitlement } from '../../server/middleware/entitlements.js'
import { requireAdminStepUp } from '../../server/middleware/adminStepUp.js'
import { writeJson } from '../../server/utils/jsonStore.js'

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
  }
}

describe('authz middleware', () => {
  test('requireAuth rejects missing bearer token', async () => {
    process.env.NODE_ENV = 'test'
    const req = { headers: {} }
    const res = createMockRes()
    const next = jest.fn()

    await requireAuth(req, res, next)

    expect(res.statusCode).toBe(401)
    expect(res.body).toEqual({ error: 'Unauthorized' })
    expect(next).not.toHaveBeenCalled()
  })

  test('requireAuth accepts valid token for existing user', async () => {
    process.env.NODE_ENV = 'test'
    const userId = `authz-${Date.now()}`
    const user = {
      id: userId,
      role: 'buyer',
      email: 'authz@example.com',
      status: 'active',
    }
    await writeJson('users.json', [user])

    const token = signToken(user)
    const req = { headers: { authorization: `Bearer ${token}` } }
    const res = createMockRes()
    const next = jest.fn()

    await requireAuth(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(req.user?.id).toBe(userId)
  })

  test('requireEntitlement returns stable premium-required payload', async () => {
    process.env.NODE_ENV = 'test'
    const userId = `ent-free-${Date.now()}`
    await writeJson('subscriptions.json', [{
      user_id: userId,
      plan: 'free',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      auto_renew: true,
    }])

    const req = { user: { id: userId, role: 'factory', subscription_status: 'free' } }
    const res = createMockRes()
    const next = jest.fn()

    await requireEntitlement('advanced_analytics')(req, res, next)

    expect(res.statusCode).toBe(403)
    expect(res.body?.code).toBe('PREMIUM_REQUIRED')
    expect(res.body?.feature).toBe('advanced_analytics')
    expect(next).not.toHaveBeenCalled()
  })

  test('requireAdminStepUp enforces code and time window', () => {
    const prevCode = process.env.ADMIN_STEPUP_CODE
    const prevWindow = process.env.ADMIN_STEPUP_MAX_MINUTES
    process.env.ADMIN_STEPUP_CODE = '123456'
    process.env.ADMIN_STEPUP_MAX_MINUTES = '1'

    const stale = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const req = { headers: { 'x-admin-stepup': '123456', 'x-admin-stepup-at': stale } }
    const res = createMockRes()
    const next = jest.fn()

    requireAdminStepUp(req, res, next)

    expect(res.statusCode).toBe(403)
    expect(res.body).toEqual({ error: 'Admin step-up window expired.' })
    expect(next).not.toHaveBeenCalled()

    process.env.ADMIN_STEPUP_CODE = prevCode
    process.env.ADMIN_STEPUP_MAX_MINUTES = prevWindow
  })
})
