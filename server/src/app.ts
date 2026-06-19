import express from 'express';
import cors from 'cors';

import authRouter from './modules/auth/auth.routes'

import './db/connection';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use('/auth', authRouter)
// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app