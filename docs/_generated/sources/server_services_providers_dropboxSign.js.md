    1 | import axios from 'axios'
    2 | import { renderContractPdfBuffer } from '../documentService.js'
    3 | 
    4 | export async function createDropboxSignSession({ contractId, contract, token }) {
    5 |   const base = (process.env.ESIGN_PROVIDER_URL || '').replace(/\/+$/, '')
    6 |   if (!base) throw new Error('ESIGN_PROVIDER_URL is not configured for Dropbox Sign')
    7 | 
    8 |   const apiKey = process.env.ESIGN_DROPBOX_SIGN_API_KEY || process.env.ESIGN_PROVIDER_API_KEY
    9 |   if (!apiKey) throw new Error('ESIGN_DROPBOX_SIGN_API_KEY is not configured')
   10 | 
   11 |   // Render PDF buffer for the contract (does not mutate contract state)
   12 |   const pdfBuffer = renderContractPdfBuffer(contract)
   13 |   const fileBase64 = pdfBuffer.toString('base64')
   14 | 
   15 |   const returnUrl = process.env.ESIGN_RETURN_URL || `${process.env.APP_BASE_URL || ''}/contracts/${contractId}/sign-return`
   16 | 
   17 |   const body = {
   18 |     filename: `${String(contract.contract_number || contractId)}.pdf`,
   19 |     file_base64: fileBase64,
   20 |     signers: [
   21 |       { role: 'buyer', name: contract.buyer_name || '', email: contract.buyer_email || '' },
   22 |       { role: 'factory', name: contract.factory_name || '', email: contract.factory_email || '' },
   23 |     ],
   24 |     metadata: { contractId, token },
   25 |     return_url: returnUrl,
   26 |   }
   27 | 
   28 |   const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }
   29 | 
   30 |   const endpoint = `${base}/signing_sessions`
   31 |   const res = await axios.post(endpoint, body, { headers, timeout: 20000 })
   32 |   const data = res?.data || {}
   33 | 
   34 |   const signing_url = data.signing_url || data.url || data.signingUrl || (data.embedded && data.embedded.sign_url)
   35 |   const session_id = data.session_id || data.id || data.request_id || data.signature_request_id
   36 |   return { signing_url, session_id, provider_id: session_id, meta: data }
   37 | }
   38 | 
   39 | export default { createDropboxSignSession }
   40 | 