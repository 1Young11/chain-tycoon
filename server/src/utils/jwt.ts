import jwt from 'jsonwebtoken'
import type { Payload } from './jwt.type'

export const SESSION_TTL_SECONDS = 60 * 60

const getJwtSecret = () => {
   const secret = process.env.JWT_SECRET
   if (!secret) throw new Error('JWT_SECRET is not configured')
   return secret
}

export const generateToken = (user: Payload): string => {
   return jwt.sign({ sub: user.sub }, getJwtSecret(), { expiresIn: SESSION_TTL_SECONDS })
}

export const verifyToken = (token: string): Payload | null => {
   try {
      const payload = jwt.verify(token, getJwtSecret())
      if (typeof payload !== 'object' || typeof payload.sub !== 'string' || !payload.sub) return null
      return { sub: payload.sub }
   } catch {
      return null
   }
}
