import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import appRouter from './routes'
import { connectTodb } from './services/db';
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { Server } from 'socket.io'
const app = express();

/* 'http://localhost:3000'*/
app.use(cors({ origin: process.env.FE_URL || 'http://localhost:3000' , credentials: true }))
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'very secret 12345',
  cookie: {
    secure: false,
    sameSite: 'none',
  }
}
))
app.use(cookieParser())
app.use(express.json())
app.use('/uploads', express.static('./uploads'))
app.use(appRouter)
console.log(process.env.BE_URL)
connectTodb()
  .then(() => {
    const port = process.env.PORT || 10000
    const server = app.listen(port, () => {
      console.log(`listening on port:  ${port}`);
    })
    const io = new Server(server, {
      cors: {
        origin: process.env.FE_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    })
    
    io.on('connection', (socket) => {
      setTimeout(() => {
        socket.on('send_post', (postDelivered) => {
          socket.broadcast.emit('receive_post', postDelivered.message)
        })
      }, 2000)
  })
})
dotenv.config()


