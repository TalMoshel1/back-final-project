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


// api/posts/1234534FGSDGZ3s#zs
router.get('/api/posts/:username', getPostsByUsername)
router.get('/api/post/:postId', getPostById)
// router.get('/api/posts/:postId/comments', getPostById, getPostComments) // if postId dont shown as query how to pass the middleware an id?
// router.get('/api/posts/:postId/likes', getPostById, getPostLikes)
router.post('/api/post', upload.array('media', 3), createPost)
router.put('/api/post/:postId', upload.array('media', 3), updatePost)
router.delete('/api/post/:postId', deletePost)

router.post('/api/post/singleMedia', upload.single('media'), (req, res) => {
	console.log(`details: ${req.file}`)
})
// router.post('/api/posts/:postId/like', getPostById, likes)
// router.post('/api/posts/:postId/unlike', getPostById, unlike)


export default router