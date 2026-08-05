import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.middleware'
import { getGameState } from './game.controller'

const router = Router()
router.get('/state', requireAuth, getGameState)
export default router
