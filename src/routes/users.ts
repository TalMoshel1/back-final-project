import express from 'express'
import appRouter from '.'
import verifyUser from '../middlewares/verify-user'
import {getUserById,getUsers,updateUser,deleteUser, createUser} from '../controllers/users-controller'
import { createPost } from '../controllers/posts-controller'

console.log('userRoutes')
const router = express.Router()

// function sendResponse(req, res) {
// 	res.json({'avi': '1'})
// }

router.use(verifyUser)

router.post('/api/user', createUser)
router.put('/api/user/:userId', updateUser)
router.delete('/api/user/:userId', deleteUser)
router.get('/api/user/:userId', getUserById)
router.get('/api/user', getUsers)
// router.get('/api/user/:username', getUserByUsername)
// router.get('/api/users/:username/followers', getFollowers)
// router.get('/api/users/:username/following', getMyFollowing)
// router.post('/api/users/follow', follow)




export default router