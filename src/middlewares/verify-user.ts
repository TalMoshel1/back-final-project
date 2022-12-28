import { verify } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/user'
import { updateTokenTimeOfUserDB, getTokenAndOptions, getUserById } from '../services/auth-service'
import { NextFunction, Response } from 'express'
import { Errors } from '../util/UserErrors'
import {Types} from 'mongoose'

const EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 90

interface User {
    fullname: string;
    created: Date;
    following: string[];
    username: string;
    password: string;
    email?: string | undefined;
    tokenCreatedAt: number;
    media: string;
}
export interface Request {
    id?: Types.ObjectId | undefined;
	media?: string;
	username?: string;
	user?: User | null | undefined;
	path: string;
	cookies: string[];
}

async function verifyUser(req: Request, res: Response, next: NextFunction) {
	const token = req.cookies['cookieInsta']  /* token return "createdAt" (date) and "signAt" (id) */
	if (req.path === '/api/login' || req.path === '/api/register') {
		return next()
	}
	if (!token ) {
		res.status(401).json(Errors.noToken)
	} else {
		try {
			const tokenValue = await verify(token, process.env.JWT_KEY) /* token return "createdAt" (date) and "signAt" (id) */
			const tokenDate = tokenValue.createdAt
			const tokenId = tokenValue.signAt.id
			const time = Date.now()
			const tokenOptions = await getTokenAndOptions(tokenId, time)
			res.cookie('cookieInsta', tokenOptions.token, tokenOptions.options)
			const user = await getUserById(tokenId)
			req.id = user?._id
			req.media = user?.media
			req.username = user?.username
			req.user = user
			res.status(200)
			next()
		}
		catch {
			res.status(401).json({ message: 'you are not authorized' })
		}
	}
}

export default verifyUser