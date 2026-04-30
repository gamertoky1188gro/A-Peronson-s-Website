    1 | import crypto from 'crypto'
    2 | import { readJson, writeJson } from '../utils/jsonStore.js'
    3 | import { createProviderSignSession } from './eSignProvider.js'
    4 | 
    5 | const DOCUMENTS_FILE = 'documents.json'
    6 | 
    7 | export async function createSignSession(contractId, actor) {
    8 |   const docs = await readJson(DOCUMENTS_FILE)
    9 |   const idx = docs.findIndex((d) => d.entity_type === 'contract' && String(d.id) === String(contractId))
   10 |   if (idx < 0) {
   11 |     const err = new Error('Contract not found')
   12 |     err.status = 404
   13 |     throw err
   14 |   }
   15 |   const contract = docs[idx]
   16 |   const actorId = String(actor?.id || '')
   17 |   if (!actorId) {
   18 |     const err = new Error('Unauthorized')
   19 |     err.status = 401
   20 |     throw err
   21 |   }
   22 | 
   23 |   const token = crypto.randomUUID()
   24 | 
   25 |   // If a real provider is configured (any supported provider type + ESIGN_PROVIDER_URL), call it
   26 |   let signingUrl
   27 |   let providerSession = null
   28 |   if (process.env.ESIGN_PROVIDER_TYPE && process.env.ESIGN_PROVIDER_URL) {
   29 |     try {
   30 |       providerSession = await createProviderSignSession({ contractId, contract, actor, token })
   31 |       signingUrl = providerSession.signing_url || providerSession.url || providerSession.signingUrl
   32 |     } catch (err) {
   33 |       // Provider call failed — fall back to configured base URL or the local stub
   34 |       console.error('createProviderSignSession failed', err)
   35 |       const providerBase = process.env.ESIGN_PROVIDER_URL || 'https://example-esign.local'
   36 |       signingUrl = `${providerBase.replace(/\/+$/, '')}/sign?contract_id=${encodeURIComponent(contractId)}&token=${encodeURIComponent(token)}`
   37 |     }
   38 |   } else {
   39 |     const providerBase = process.env.ESIGN_PROVIDER_URL || 'https://example-esign.local'
   40 |     signingUrl = `${providerBase.replace(/\/+$/, '')}/sign?contract_id=${encodeURIComponent(contractId)}&token=${encodeURIComponent(token)}`
   41 |   }
   42 | 
   43 |   contract.artifact = contract.artifact || {}
   44 |   contract.artifact.signing_url = signingUrl
   45 |   contract.artifact.signing_token = token
   46 |   if (providerSession && providerSession.session_id) contract.artifact.provider_session_id = providerSession.session_id
   47 |   if (providerSession && providerSession.provider_id) contract.artifact.provider_request_id = providerSession.provider_id
   48 |   if (providerSession && providerSession.meta) contract.artifact.provider_meta = providerSession.meta
   49 |   contract.updated_at = new Date().toISOString()
   50 |   docs[idx] = contract
   51 |   await writeJson(DOCUMENTS_FILE, docs)
   52 |   return { signing_url: signingUrl, token }
   53 | }
   54 | 
   55 | export async function handleSignCallback(contractId, payload = {}) {
   56 |   const docs = await readJson(DOCUMENTS_FILE)
   57 |   const idx = docs.findIndex((d) => d.entity_type === 'contract' && String(d.id) === String(contractId))
   58 |   if (idx < 0) {
   59 |     const err = new Error('Contract not found')
   60 |     err.status = 404
   61 |     throw err
   62 |   }
   63 |   const contract = docs[idx]
   64 | 
   65 |   if (payload.buyer_signed) {
   66 |     contract.buyer_signature_state = 'signed'
   67 |     contract.buyer_signed_at = contract.buyer_signed_at || new Date().toISOString()
   68 |   }
   69 |   if (payload.factory_signed) {
   70 |     contract.factory_signature_state = 'signed'
   71 |     contract.factory_signed_at = contract.factory_signed_at || new Date().toISOString()
   72 |   }
   73 | 
   74 |   contract.updated_at = new Date().toISOString()
   75 |   docs[idx] = contract
   76 | 
   77 |   // If both signed, attempt to generate PDF artifact by delegating to documentService
   78 |   try {
   79 |     if (contract.buyer_signature_state === 'signed' && contract.factory_signature_state === 'signed') {
   80 |       const { generateContractArtifact } = await import('./documentService.js')
   81 |       if (typeof generateContractArtifact === 'function') {
   82 |         const artifact = await generateContractArtifact(contract)
   83 |         contract.artifact = { ...(contract.artifact || {}), ...artifact }
   84 |         docs[idx] = contract
   85 |       }
   86 |     }
   87 |   } catch {
   88 |     // swallow generation errors - caller can retry
   89 |   }
   90 | 
   91 |   await writeJson(DOCUMENTS_FILE, docs)
   92 |   return contract
   93 | }
   94 | 