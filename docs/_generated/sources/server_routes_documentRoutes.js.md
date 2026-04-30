    1 | import { Router } from 'express'
    2 | import express from 'express'
    3 | import multer from 'multer'
    4 | import { requireAuth } from '../middleware/auth.js'
    5 | import {
    6 |   createContractDraft,
    7 |   getContracts,
    8 |   getContractAudit,
    9 |   getDocuments,
   10 |   patchContractArtifact,
   11 |   patchContractSignatures,
   12 |   registerDocumentUrl,
   13 |   removeDocument,
   14 |   uploadDocument,
   15 |   createContractSignSession,
   16 |   createContractSignCallback,
   17 | } from '../controllers/documentController.js'
   18 | 
   19 | const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })
   20 | const router = Router()
   21 | 
   22 | router.post('/', requireAuth, upload.single('file'), uploadDocument)
   23 | router.post('/url', requireAuth, registerDocumentUrl)
   24 | 
   25 | router.post('/contracts/draft', requireAuth, createContractDraft)
   26 | router.post('/contracts/:contractId/sign-session', requireAuth, createContractSignSession)
   27 | // Provider webhook (no auth) - validate with ESIGN_WEBHOOK_SECRET
   28 | router.post('/contracts/:contractId/sign-callback', express.raw({ type: '*/*', limit: '1mb' }), createContractSignCallback)
   29 | router.get('/contracts', requireAuth, getContracts)
   30 | router.get('/contracts/:contractId/audit', requireAuth, getContractAudit)
   31 | router.patch('/contracts/:contractId/signatures', requireAuth, patchContractSignatures)
   32 | router.patch('/contracts/:contractId/artifact', requireAuth, patchContractArtifact)
   33 | router.get('/', requireAuth, getDocuments)
   34 | router.delete('/:documentId', requireAuth, removeDocument)
   35 | 
   36 | export default router
   37 | 