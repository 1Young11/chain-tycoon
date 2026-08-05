import type { Request, Response } from 'express'
import type { AuthenticatedRequest } from '../../middleware/auth.middleware'
import { getGameState as loadGameState } from './game.service'

export async function getGameState(req: Request, res: Response) {
   try {
      const data = await loadGameState((req as AuthenticatedRequest).auth.userId)
      res.json({ success: true, data })
   } catch (error) {
      console.error('Failed to load game state', error)
      res.status(500).json({ success: false, error: 'Unable to load game state' })
   }
}
