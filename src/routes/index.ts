import authRouter from './auth'
import postsRouter from './posts'
import usersRouter from './users'
import feedRouter from './feed'

import express from 'express'

const appRouter = express.Router()


appRouter.use(feedRouter)
appRouter.use(authRouter)
appRouter.use(postsRouter)
appRouter.use(usersRouter)

export default appRouter
