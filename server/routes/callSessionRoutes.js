import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  createScheduledCall,
  endCall,
  getCall,
  getCallHistory,
  joinFriendCall,
  joinOrCreateCall,
  startCall,
  updateRecording,
} from '../controllers/callSessionController.js'

const router = Router()

router.post('/scheduled', requireAuth, createScheduledCall)
router.post('/join', requireAuth, joinOrCreateCall)
router.post('/friend/:userId/join', requireAuth, joinFriendCall)
router.get('/history', requireAuth, getCallHistory)
router.get('/:callId', requireAuth, getCall)
router.post('/:callId/start', requireAuth, startCall)
router.post('/:callId/end', requireAuth, endCall)
router.patch('/:callId/recording', requireAuth, updateRecording)

export default router
