    1 | import { Router } from 'express'
    2 | import multer from 'multer'
    3 | import path from 'path'
    4 | import fs from 'fs'
    5 | import { requireAuth } from '../middleware/auth.js'
    6 | import {
    7 |   createScheduledCall,
    8 |   endCall,
    9 |   getCall,
   10 |   getCallsByContract,
   11 |   getCallIceServers,
   12 |   getCallHistory,
   13 |   getRecording,
   14 |   getPendingInvites,
   15 |   joinFriendCall,
   16 |   joinOrCreateCall,
   17 |   markRecordingViewedController,
   18 |   startCall,
   19 |   updateRecording,
   20 |   uploadRecordingFile,
   21 | } from '../controllers/callSessionController.js'
   22 | 
   23 | const router = Router()
   24 | 
   25 | const callsUploadRoot = path.join(process.cwd(), 'server', 'uploads', 'calls')
   26 | if (!fs.existsSync(callsUploadRoot)) fs.mkdirSync(callsUploadRoot, { recursive: true })
   27 | 
   28 | const recordingUpload = multer({
   29 |   storage: multer.diskStorage({
   30 |     destination: (_req, _file, cb) => cb(null, callsUploadRoot),
   31 |     filename: (req, file, cb) => {
   32 |       const ext = path.extname(file.originalname || '').toLowerCase() || '.webm'
   33 |       const safeExt = ['.webm', '.mp4', '.ogg'].includes(ext) ? ext : '.webm'
   34 |       const safeCallId = String(req.params.callId || 'call').replace(/[^a-zA-Z0-9_-]/g, '_')
   35 |       cb(null, `${safeCallId}-${Date.now()}${safeExt}`)
   36 |     },
   37 |   }),
   38 |   limits: { fileSize: 120 * 1024 * 1024 },
   39 | })
   40 | 
   41 | router.post('/scheduled', requireAuth, createScheduledCall)
   42 | router.post('/join', requireAuth, joinOrCreateCall)
   43 | router.post('/friend/:userId/join', requireAuth, joinFriendCall)
   44 | router.get('/history', requireAuth, getCallHistory)
   45 | router.get('/by-contract/:contractId', requireAuth, getCallsByContract)
   46 | router.get('/pending', requireAuth, getPendingInvites)
   47 | router.get('/:callId/ice', requireAuth, getCallIceServers)
   48 | router.get('/:callId', requireAuth, getCall)
   49 | router.post('/:callId/start', requireAuth, startCall)
   50 | router.post('/:callId/end', requireAuth, endCall)
   51 | router.patch('/:callId/recording', requireAuth, updateRecording)
   52 | router.get('/:callId/recording', requireAuth, getRecording)
   53 | router.post('/:callId/recording/viewed', requireAuth, markRecordingViewedController)
   54 | router.post('/:callId/recording/upload', requireAuth, recordingUpload.single('file'), uploadRecordingFile)
   55 | 
   56 | export default router
   57 | 