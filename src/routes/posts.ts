// @ts-nocheck
import express from 'express'
import verifyUser from '../middlewares/verify-user'
import upload from '../middlewares/upload'
import {
	getPostById, getPosts, getFeed, deletePost, updatePost, valdiateUserAsCreatorOfPost,
	getPostComments, getPostLikes, likes, unlike, createPost, getPostsByUsername
} from '../controllers/posts-controller'
const router = express.Router()


function sendResponse(req, res) {
	return res.json({ 'avi': '1' })
}

router.use(verifyUser)


router.get('/api/posts/:username', getPostsByUsername)
router.get('/api/post/:postId', getPostById)
router.post('/api/post', upload.array('media', 3), createPost)
router.put('/api/post/:postId', upload.array('media', 3), updatePost)
router.delete('/api/post/:postId', deletePost)

export default router