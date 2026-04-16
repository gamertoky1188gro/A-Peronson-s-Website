import { jest } from '@jest/globals'

function createMockRes(headersSent = false) {
  return {
    headersSent,
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

describe('errorHandler stable contract', () => {
  test('returns 500 with stable payload when headers are not sent', async () => {
    jest.unstable_mockModule('../../server/utils/logger.js', () => ({ logError: jest.fn() }))
    const { errorHandler } = await import('../../server/middleware/errorHandler.js')

    const req = {}
    const res = createMockRes(false)
    const next = jest.fn()
    const err = new Error('boom')

    errorHandler(err, req, res, next)

    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ error: 'Internal server error' })
    expect(next).not.toHaveBeenCalled()
  })

  test('delegates to next when headers already sent', async () => {
    jest.unstable_mockModule('../../server/utils/logger.js', () => ({ logError: jest.fn() }))
    const { errorHandler } = await import('../../server/middleware/errorHandler.js')

    const req = {}
    const res = createMockRes(true)
    const next = jest.fn()
    const err = new Error('already-started')

    errorHandler(err, req, res, next)

    expect(next).toHaveBeenCalledWith(err)
  })
})
