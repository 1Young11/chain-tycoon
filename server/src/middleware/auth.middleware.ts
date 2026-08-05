import type { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../utils/jwt'
import { SESSION_COOKIE_NAME } from '../utils/auth-cookies'
import type { RequestWithCookies } from './cookies.middleware'

export interface AuthenticatedRequest extends Request {
   auth: {
      userId: string
   }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
   const token = (req as RequestWithCookies).cookies?.[SESSION_COOKIE_NAME]
   const payload = token ? verifyToken(token) : null

   if (!payload?.sub) {
      res.status(401).json({ success: false, error: 'Authentication required' })
      return
   }

   ;(req as AuthenticatedRequest).auth = { userId: payload.sub }
   next()
}
