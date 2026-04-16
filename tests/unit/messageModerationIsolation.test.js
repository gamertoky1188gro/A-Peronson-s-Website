import messageRoutes from '../../server/routes/messageRoutes.js'
import { canAccessMatch, postMessage } from '../../server/services/messageService.js'
import { sendMessage } from '../../server/controllers/messageController.js'
import { writeJson } from '../../server/utils/jsonStore.js'

function routeEntries(router) {
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({ path: layer.route.path, methods: Object.keys(layer.route.methods) }))
}

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

describe('message routes and service moderation/isolation', () => {
  test('messageRoutes exposes send and read endpoints', () => {
    const entries = routeEntries(messageRoutes)
    expect(entries).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: '/:matchId', methods: expect.arrayContaining(['post']) }),
      expect.objectContaining({ path: '/:matchId', methods: expect.arrayContaining(['get']) }),
      expect.objectContaining({ path: '/:matchId/read', methods: expect.arrayContaining(['post']) }),
    ]))
  })

  test('canAccessMatch isolates friend thread to participants', async () => {
    process.env.NODE_ENV = 'test'
    const a = 'friend-a'
    const b = 'friend-b'
    const outsider = 'friend-c'
    const matchId = `friend:${a}:${b}`

    await writeJson('user_connections.json', [{
      id: 'conn-1',
      type: 'friend',
      requester_id: a,
      receiver_id: b,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])

    expect(await canAccessMatch(matchId, a)).toBe(true)
    expect(await canAccessMatch(matchId, outsider)).toBe(false)
  })

  test('postMessage moderates outside-contact content', async () => {
    process.env.NODE_ENV = 'test'
    const now = Date.now()
    const buyerId = `buyer-${now}`
    const supplierId = `factory-${now}`
    const reqId = `req-${now}`
    const matchId = `${reqId}:${supplierId}`

    await writeJson('users.json', [
      { id: buyerId, role: 'buyer', status: 'active', verified: true, name: 'Buyer', email: 'buyer@example.com' },
      { id: supplierId, role: 'factory', status: 'active', verified: true, name: 'Supplier', email: 'supplier@example.com' },
    ])
    await writeJson('requirements.json', [{ id: reqId, buyer_id: buyerId, verified_only: false }])
    await writeJson('messages.json', [])
    await writeJson('message_queue_items.json', [])
    await writeJson('message_policy_logs.json', [])
    await writeJson('message_queue.json', [])
    await writeJson('message_policy_decisions.json', [])
    await writeJson('communication_limits.json', [])
    await writeJson('communication_policy_configs.json', [])
    await writeJson('sender_reputation.json', [])
    await writeJson('policy_metrics.json', {})
    await writeJson('violations.json', [])
    await writeJson('notifications.json', [])
    await writeJson('message_requests.json', [])
    await writeJson('conversation_locks.json', [])

    const created = await postMessage(matchId, buyerId, 'my email is test@example.com', 'text')

    expect(created.moderated).toBe(true)
    expect(String(created.message)).toMatch(/Removed: outside contact/i)
  })

  test('sendMessage controller returns 403 for friend thread outsider', async () => {
    process.env.NODE_ENV = 'test'
    const req = {
      params: { matchId: 'friend:u1:u2' },
      user: { id: 'u3', role: 'buyer' },
      body: { message: 'hello' },
    }
    const res = createMockRes()

    await sendMessage(req, res)

    expect(res.statusCode).toBe(403)
    expect(String(res.body?.error || '')).toMatch(/Only connected friends/i)
  })
})
