import express from 'express'
import appRouter from '.'
import verifyUser from '../middlewares/verify-user'
import { getUserById, getUsers, updateUser, deleteUser, createUser, follow, unFollow } from '../controllers/users-controller'
import { createPost } from '../controllers/posts-controller'
import upload from '../middlewares/upload'
// import multer from 'multer'
// const upload = multer()

const router = express.Router()

// function sendResponse(req, res) {
// 	res.json({'avi': '1'})
// }

router.use(verifyUser)

router.post('/api/user', createUser)
router.put('/api/user/:userId', upload.single('media'), updateUser)
router.delete('/api/user/:userId', deleteUser)
router.get('/api/user/:userId', getUserById)
router.get('/api/user', getUsers)
// router.post('/upload', upload.single('file'), (req,res)=>{
//     console.log(req.body)
//     console.log(req.file)
// })
// router.get('/api/user/:username', getUserByUsername)
// router.get('/api/users/:username/followers', getFollowers)
// router.get('/api/users/:username/following', getMyFollowing)
router.post('/api/users/follow', follow)
router.post('/api/users/unfollow', unFollow)





export default router