import http from 'http'

describe('remote ai verifier integration', () => {
  let server
  let url

  beforeAll(async () => {
    server = http.createServer(async (req, res) => {
      if (req.method !== 'POST') return res.end('ok')
      let body = ''
      for await (const chunk of req) body += chunk
      try {
        const json = JSON.parse(body)
        const extracted = json.extracted || {}
        const verified = Boolean(extracted.product_type && extracted.product_type === 'remote-test')
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ verified, score: verified ? 1 : 0, notes: verified ? 'remote OK' : 'remote missing' }))
      } catch (e) {
        res.writeHead(400)
        res.end('bad')
      }
    })

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
    const addr = server.address()
    url = `http://127.0.0.1:${addr.port}/verify`
    process.env.AI_VERIFIER_URL = url
  })

  afterAll(async () => {
    if (server && typeof server.close === 'function') {
      await new Promise((resolve) => server.close(resolve))
    }
  })

  test('uses remote verifier when configured', async () => {
    const { verifyExtraction } = await import('../../server/services/aiVerifier.js')
    const ok = await verifyExtraction({ product_type: 'remote-test' })
    expect(ok).toBeDefined()
    expect(ok.verified).toBe(true)
    const no = await verifyExtraction({})
    expect(no).toBeDefined()
    expect(no.verified).toBe(false)
  })
})
