import express from 'express'
// import {login, register, userInfo} from '../controllers/auth-controller'
import verifyUser from '../middlewares/verify-user'
import {register, login} from '../controllers/auth-controller'
import bcrypt from 'bcrypt'

const router = express.Router()

// async function isValidProps(username, password) {
// 	const promise = new Promise((resolve, reject) => {
// 		if (username === 'username' && password === 'password') {
// 			resolve([username, password] )
// 		} else {
// 			reject('the props are not correct')
// 		}
// 	})
// 	return promise
// }




// router.get('/api', (req,res) => {
//     res.send('ho ye!')
//     console.log('yes! api call work')
// })
router.post('/api/login', login)
router.post('/api/register', register)
router.get('/api/user-info',verifyUser, (req, res) => {
    // console.log(req.username)
    res.json(req.user)
} )


export default router