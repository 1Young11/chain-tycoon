import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import type { RequestWithCookies } from './cookies.middleware'
import { CSRF_COOKIE_NAME, csrfCookieOptions } from '../utils/auth-cookies'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

const getCsrfSecret = () => {
   const secret = process.env.CSRF_SECRET
   if (!secret) throw new Error('CSRF_SECRET is not configured')
   return secret
}

const signToken = (token: string) => createHmac('sha256', getCsrfSecret()).update(token).digest('base64url')

const safeEqual = (left: string, right: string) => {
   const leftBuffer = Buffer.from(left)
   const rightBuffer = Buffer.from(right)
   return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

export function createCsrfToken() {
   const token = randomBytes(32).toString('base64url')
   return { token, signedToken: `${token}.${signToken(token)}` }
}

export function issueCsrfToken(_req: Request, res: Response) {
   const { token, signedToken } = createCsrfToken()
   res.setHeader('Cache-Control', 'no-store')
   res.cookie(CSRF_COOKIE_NAME, signedToken, csrfCookieOptions())
   res.json({ csrfToken: token })
}

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
   if (SAFE_METHODS.has(req.method.toUpperCase())) {
      next()
      return
   }

   const cookie = (req as RequestWithCookies).cookies?.[CSRF_COOKIE_NAME]
   const header = req.header('x-csrf-token')
   const separator = cookie?.lastIndexOf('.') ?? -1

   if (!cookie || !header || separator < 1) {
      res.status(403).json({ error: 'Invalid CSRF token' })
      return
   }

   const token = cookie.slice(0, separator)
   const signature = cookie.slice(separator + 1)
   const expectedSignature = signToken(token)

   if (!safeEqual(header, token) || !safeEqual(signature, expectedSignature)) {
      res.status(403).json({ error: 'Invalid CSRF token' })
      return
   }

   next()
}
