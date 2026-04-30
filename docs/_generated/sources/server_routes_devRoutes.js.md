    1 | import { Router } from 'express'
    2 | import axios from 'axios'
    3 | import crypto from 'crypto'
    4 | 
    5 | const router = Router()
    6 | 
    7 | const BASE_URL = (process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 4000}`).replace(/\/+$/, '')
    8 | 
    9 | // Create a simple signing session (sandbox)
   10 | router.post('/esign/signing_sessions', (req, res) => {
   11 |   const { contractId } = req.body || {}
   12 |   const sessionId = crypto.randomUUID()
   13 |   const signing_url = `${BASE_URL}/api/dev/esign/embedded?contractId=${encodeURIComponent(contractId)}&sessionId=${sessionId}`
   14 |   return res.json({ signing_url, session_id: sessionId })
   15 | })
   16 | 
   17 | // Embedded signing simulator page
   18 | router.get('/esign/embedded', (req, res) => {
   19 |   const contractId = req.query.contractId || ''
   20 |   const sessionId = req.query.sessionId || ''
   21 |   res.set('Content-Type', 'text/html')
   22 |   res.send(`<!doctype html><html><head><meta charset="utf-8"><title>ESign Sandbox</title></head><body><h2>ESign Sandbox</h2><p>Contract: ${contractId}</p><p>Session: ${sessionId}</p><button id="buyer">Sign as Buyer</button> <button id="factory">Sign as Factory</button><script>async function post(role){ const resp = await fetch('/api/dev/esign/simulate_callback?contractId=${encodeURIComponent(contractId)}&role='+role,{method:'POST'}); const json=await resp.json(); alert(JSON.stringify(json)); }document.getElementById('buyer').onclick=()=>post('buyer');document.getElementById('factory').onclick=()=>post('factory');</script></body></html>`)
   23 | })
   24 | 
   25 | // Simulate provider webhook callback: posts to the real webhook endpoint with HMAC header
   26 | router.post('/esign/simulate_callback', async (req, res) => {
   27 |   try {
   28 |     const contractId = String(req.query.contractId || (req.body && req.body.contractId) || '')
   29 |     const role = String((req.query.role || (req.body && req.body.role) || 'buyer')).toLowerCase()
   30 |     if (!contractId) return res.status(400).json({ error: 'contractId required' })
   31 | 
   32 |     const payload = role === 'factory' ? { factory_signed: true } : { buyer_signed: true }
   33 |     const payloadString = JSON.stringify(payload)
   34 | 
   35 |     const secret = String(process.env.ESIGN_WEBHOOK_SECRET || '')
   36 |     const headers = { 'Content-Type': 'application/json' }
   37 |     if (secret) {
   38 |       const timestamp = Math.floor(Date.now() / 1000)
   39 |       const signedPayload = `${timestamp}.${payloadString}`
   40 |       const sig = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')
   41 |       headers['x-esign-signature'] = `t=${timestamp},v1=${sig}`
   42 |     }
   43 | 
   44 |     const target = `${BASE_URL}/api/documents/contracts/${encodeURIComponent(contractId)}/sign-callback`
   45 |     const response = await axios.post(target, payloadString, { headers, timeout: 10000 })
   46 |     return res.json({ ok: true, proxiedStatus: response.status, proxiedBody: response.data })
   47 |   } catch (err) {
   48 |     return res.status(500).json({ ok: false, error: err?.message || String(err) })
   49 |   }
   50 | })
   51 | 
   52 | export default router
   53 | 