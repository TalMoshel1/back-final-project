import { verify } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/user'
import { updateTokenTimeOfUserDB, getTokenAndOptions, getUserById } from '../services/auth-service'
import { NextFunction, Request, Response } from 'express'
import { AuthenticatedRequest } from '../types'
import { Errors } from '../util/UserErrors'

const EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 90

async function verifyUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
	const token = req.cookies['cookieInsta']  /* token return "createdAt" (date) and "signAt" (id) */
	if (req.path === '/api/login' || req.path === '/api/register') {
		return next()
	}
	if (!token ) {
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