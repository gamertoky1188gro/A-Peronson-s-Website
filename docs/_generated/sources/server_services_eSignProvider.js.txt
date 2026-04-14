    1 | import axios from 'axios'
    2 | import { createDropboxSignSession } from './providers/dropboxSign.js'
    3 | 
    4 | /**
    5 |  * Dispatcher for available provider adapters. Accepts the contract object
    6 |  * so adapters can render or upload the PDF if needed.
    7 |  */
    8 | export async function createProviderSignSession({ contractId, contract, actor, token }) {
    9 |   const providerType = String(process.env.ESIGN_PROVIDER_TYPE || '').toLowerCase()
   10 | 
   11 |   if (providerType === 'dropbox_sign' || providerType === 'dropbox') {
   12 |     return createDropboxSignSession({ contractId, contract, actor, token })
   13 |   }
   14 | 
   15 |   // Fallback: generic HTTP adapter that posts JSON to /signing_sessions
   16 |   const base = process.env.ESIGN_PROVIDER_URL
   17 |   if (!base) throw new Error('ESIGN_PROVIDER_URL is not configured')
   18 |   const endpoint = `${base.replace(/\/+$/, '')}/signing_sessions`
   19 | 
   20 |   const headers = { 'Content-Type': 'application/json' }
   21 |   if (process.env.ESIGN_PROVIDER_API_KEY) {
   22 |     headers['Authorization'] = `Bearer ${process.env.ESIGN_PROVIDER_API_KEY}`
   23 |   }
   24 | 
   25 |   const returnUrl = process.env.ESIGN_RETURN_URL || `${process.env.APP_BASE_URL || ''}/contracts/${contractId}/sign-return`
   26 |   const body = {
   27 |     contractId,
   28 |     token,
   29 |     contract: contract || null,
   30 |     actor: { id: String(actor?.id || '') },
   31 |     return_url: returnUrl,
   32 |     metadata: {
   33 |       contractId,
   34 |       token,
   35 |     },
   36 |   }
   37 | 
   38 |   const res = await axios.post(endpoint, body, { headers, timeout: 10000 })
   39 |   const data = res?.data || {}
   40 | 
   41 |   // Normalize common shapes into a small response contract
   42 |   const signing_url = data.signing_url || data.url || data.signingUrl || (data.embedded && data.embedded.sign_url)
   43 |   const session_id = data.session_id || data.id || data.request_id || data.signature_request_id
   44 |   return { signing_url, session_id, meta: data }
   45 | }
   46 | 