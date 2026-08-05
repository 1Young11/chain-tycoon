import express from 'express';
import cors from 'cors';

import authRouter from './modules/auth/auth.routes'
import gameRouter from './modules/game/game.routes'
import { cookiesMiddleware } from './middleware/cookies.middleware'
import { requireCsrf } from './middleware/csrf.middleware'

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
}))

app.use(express.json())
app.use(cookiesMiddleware)
app.use(requireCsrf)
app.use('/auth', authRouter)
app.use('/game', gameRouter)
// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
