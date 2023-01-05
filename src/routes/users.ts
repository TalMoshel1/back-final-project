// @ts-nocheck
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

if (process.env.NODE_ENV === 'development') {router.use(verifyUser)}


router.post('/api/user', createUser)
router.put('/api/user/:userId', upload.single('media'), updateUser)
router.delete('/api/user/:userId', deleteUser)
router.get('/api/user/:userId', getUserById)
router.get('/api/user', getUsers)
router.post('/api/users/follow', follow)
router.post('/api/users/unfollow', unFollow)





export default router



