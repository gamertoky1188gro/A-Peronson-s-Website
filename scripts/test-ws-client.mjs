import WebSocket from 'ws'

const url = process.env.WS_URL || 'ws://localhost:4000/ws'
const maxAttempts = 12
const attemptDelay = 1000

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

async function tryConnectOnce() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url)
    let closed = false
    const openTimer = setTimeout(() => {
      if (!closed) {
        try { ws.terminate() } catch {}
        reject(new Error('open_timeout'))
      }
    }, 6000)

    ws.on('open', () => {
      clearTimeout(openTimer)
      console.log('WS open')
      // Listen for messages
      ws.on('message', (m) => {
        try {
          const data = JSON.parse(String(m || ''))
          console.log('RECV:', JSON.stringify(data))
          if (data.type === 'reply') {
            closed = true
            try { ws.close() } catch {}
            resolve({ ok: true, data })
          }
        } catch (err) {
          console.log('RAW RECV:', String(m))
        }
      })

      ws.on('error', (err) => {
        if (!closed) {
          closed = true
          try { ws.close() } catch {}
          reject(err)
        }
      })

      ws.on('close', () => {
        if (!closed) {
          closed = true
          reject(new Error('closed_before_reply'))
        }
      })

      // Send a test ask
      const payload = { type: 'ask', question: 'Hello from test-ws-client', request_id: 'test-ws-1' }
      try {
        ws.send(JSON.stringify(payload))
      } catch (err) {
        // ignore
      }

      // fallback timeout for reply
      setTimeout(() => {
        if (!closed) {
          closed = true
          try { ws.close() } catch {}
          reject(new Error('reply_timeout'))
        }
      }, 15000)
    })

    ws.on('error', (err) => {
      clearTimeout(openTimer)
      if (!closed) {
        closed = true
        reject(err)
      }
    })
  })
}

async function main() {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      console.log(`Attempt ${i + 1}/${maxAttempts} -> ${url}`)
      const res = await tryConnectOnce()
      console.log('Success:', res.data)
      process.exit(0)
    } catch (err) {
      console.log('Attempt failed:', err?.message || err)
      if (i + 1 < maxAttempts) await sleep(attemptDelay)
    }
  }
  console.error('All attempts failed')
  process.exit(2)
}

main()
