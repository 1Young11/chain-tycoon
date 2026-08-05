import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'

export interface AuthenticatedRequest extends Request {
   auth: {
      userId: string
      email: string
   }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
   const header = req.header('authorization')
   const token = header?.startsWith('Bearer ') ? header.slice(7) : null
   const payload = token ? verifyToken(token) : null

   if (!payload?.sub || !payload.email) {
      res.status(401).json({ success: false, error: 'Authentication required' })
      return
   }

   ;(req as AuthenticatedRequest).auth = { userId: payload.sub, email: payload.email }
   next()
}
