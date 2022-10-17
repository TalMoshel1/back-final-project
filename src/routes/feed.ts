import express from 'express'
// import {login, register, userInfo} from '../controllers/auth-controller'
import verifyUser from '../middlewares/verify-user'
import {FollowingsById, getFeed} from '../controllers/feed-controller'
const router = express.Router()





router.use(verifyUser)

router.get('/api/post/feed', FollowingsById, getFeed)




export default router