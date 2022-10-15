import { verify } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
// import { trusted } from 'mongoose'
import { UserModel } from '../models/user'
import { updateTokenTimeOfUserDB, getTokenAndOptions, getUserById } from '../services/auth-service'
import { NextFunction, Request, Response } from 'express'
import { MyRequest } from '../types'
import { Errors } from '../util/UserErrors'

const VALIDATION_30MINUTES = 1000 * 60 * 30
const EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 90
const EXPIRATION_THRESHOLD = EXPIRATION_TIME * 0.75

// async function verifyUser(req: Request, res: Response, next: NextFunction) {
// 	const token = req.cookies['cookieInsta']  /* token return "createdAt" (date) and "signAt" (id) */
// 	if (!token) {
// 		// console.log('no token', token, req.cookies['cookieInsta'])
// 		res.status(401).json({message: 'no token'})
// 	} else {
// 		try {
// 			const tokenValue = await verify(token, process.env.SECRET) /* token return "createdAt" (date) and "signAt" (id) */
// 			const tokenDate = tokenValue.createdAt
// 			const tokenId = tokenValue.signAt.id
// 			if (Date.now() - tokenDate > EXPIRATION_TIME) {
// 				res.status(401)
// 			} else if (Date.now() - tokenDate < VALIDATION_30MINUTES) { /* above 30 mintues, create new token */
// 				// console.log('passed before 30 minutes')
// 				const user = await getUserById(tokenId)
// 				req.id = user?._id
// 				req.username = user?.username
// 				req.user = user
// 				next()
// 			} else {
// 				const time = Date.now()
// 				const tokenOptions = await getTokenAndOptions(tokenId, time)
// 				// updateTokenTimeOfUserDB(tokenId, time)
// 				// console.log('above 30 minutes succeded')
// 				res.cookie('cookieInsta', tokenOptions.token, tokenOptions.options)
// 				const user = await getUserById(tokenId)				
// 				req.id = user?._id
// 				req.username = user?.username
// 				req.user = user
// 				next()
// 			}
// 		}
// 		catch {
// 			console.log('verification failed', req.cookies)
// 			console.log(res.cookies)
// 			res.status(401).json({ message: 'you are not authorized' })
// 		}
// 	}
// }

async function verifyUser(req: MyRequest, res: Response, next: NextFunction) {
	const token = req.cookies['cookieInsta']  /* token return "createdAt" (date) and "signAt" (id) */
	if (!token) {
		// console.log('no token', token, req.cookies['cookieInsta'])
		res.status(401).json(Errors.noToken)
	} else {
		try {
			const tokenValue = await verify(token, process.env.SECRET) /* token return "createdAt" (date) and "signAt" (id) */
			const tokenDate = tokenValue.createdAt
			const tokenId = tokenValue.signAt.id
			const time = Date.now()
			const tokenOptions = await getTokenAndOptions(tokenId, time)
			res.cookie('cookieInsta', tokenOptions.token, tokenOptions.options)
			const user = await getUserById(tokenId)
			req.id = user?._id
			req.username = user?.username
			req.user = user
			next()
		}
		catch {
			console.log('verification failed', req.cookies)
			res.status(401).json({ message: 'you are not authorized' })
		}
	}
}

export default verifyUser