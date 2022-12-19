import express from 'express'
// import {login, register, userInfo} from '../controllers/auth-controller'
import verifyUser from '../middlewares/verify-user'
import { FollowingsById, getFeedPosts, getFeedSuggestions } from '../controllers/feed-controller'
const router = express.Router()





router.use(verifyUser)

router.get('/api/post/feed', FollowingsById, getFeedPosts)
router.get('/api/suggestions/feed',FollowingsById, getFeedSuggestions )

// router.get('/api/suggestions/feed', FollowingsById, getFeedSuggestions )




export default router