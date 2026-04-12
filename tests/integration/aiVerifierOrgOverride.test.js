import http from 'http'

describe('org-level ai verifier override', () => {
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
        const verified = Boolean(extracted.product_type && extracted.product_type === 'org-override')
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ verified, score: verified ? 1 : 0, notes: verified ? 'org override' : 'no' }))
      } catch (e) {
        res.writeHead(400)
        res.end('bad')
      }
    })

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
    const addr = server.address()
    url = `http://127.0.0.1:${addr.port}/verify`

    const jsonStore = await import('../../server/utils/jsonStore.js')
    // write per-org ai settings to point to our test server
    await jsonStore.writeJson('org_ai_settings.json', [{ id: 'org1', org_owner_id: 'org1', ai_verifier_url: url, ai_verifier_api_key: '' }])
  })

  afterAll(async () => {
    if (server && typeof server.close === 'function') {
      await new Promise((resolve) => server.close(resolve))
    }
  })

  test('uses org verifier when present', async () => {
    const { verifyExtraction } = await import('../../server/services/aiVerifier.js')
    const ok = await verifyExtraction({ product_type: 'org-override' }, 'org1')
    expect(ok).toBeDefined()
    expect(ok.verified).toBe(true)
    const no = await verifyExtraction({}, 'org1')
    expect(no).toBeDefined()
    expect(no.verified).toBe(false)
  })
})
