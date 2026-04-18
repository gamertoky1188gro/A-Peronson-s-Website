import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { combinedFeed } from '../controllers/feedController.js'
import { getMyFeedPosts, patchFeedPost, postFeedPost, removeFeedPost } from '../controllers/feedPostController.js'

const router = Router()
router.get('/posts/mine', requireAuth, getMyFeedPosts)
router.post('/posts', requireAuth, postFeedPost)
router.patch('/posts/:postId', requireAuth, patchFeedPost)
router.delete('/posts/:postId', requireAuth, removeFeedPost)
router.get('/', requireAuth, combinedFeed)
export default router
