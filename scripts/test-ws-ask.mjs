import WebSocket from 'ws'

const url = process.env.WS_URL || 'ws://localhost:4000/ws'
const reqId = `test-ask-${Date.now()}`

console.log('Connecting to', url, 'request_id=', reqId)

const ws = new WebSocket(url)
let replied = false

ws.on('open', () => {
  console.log('open')
  ws.send(JSON.stringify({ type: 'ask', question: 'What is GarTex Hub?', request_id: reqId }))
})

ws.on('message', (m) => {
  try {
    const d = JSON.parse(String(m || ''))
    console.log('RECV:', d.type, d.request_id || null)
    if (d.type === 'reply' && d.request_id === reqId) {
      console.log('MATCHING REPLY:', d.matched_answer || d.answer || d.message)
      replied = true
      ws.close()
      process.exit(0)
    }
  } catch (err) {
    console.log('RAW:', String(m))
  }
})

ws.on('error', (err) => {
  console.error('ERR', err)
  process.exit(2)
})

setTimeout(() => {
  if (!replied) {
    console.error('No matching reply received within timeout')
    process.exit(2)
  }
}, 20000)
