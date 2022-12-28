// @ts-nocheck
import express from 'express'
import verifyUser from '../middlewares/verify-user'
import {register, login} from '../controllers/auth-controller'
import { Request } from '../types__interfaces'

const router = express.Router()

router.post('/api/login', login)
router.post('/api/register', register)
router.get('/api/user-info',verifyUser, (req: Request, res) => {
    res.json(req.user)
} )
router.get('/api/logout', (req,res)=>{
    return res.clearCookie('cookieInsta')
    .status(200)
    .json({message: 'Successfully logged out'})
})

export default router