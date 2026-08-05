import { Request, Response } from 'express'
import * as authService from './auth.service'
import type { AuthenticatedRequest } from '../../middleware/auth.middleware'
import { clearAuthCookies, setSessionCookie } from '../../utils/auth-cookies'
import { generateToken } from '../../utils/jwt'

type AuthService = Pick<typeof authService, 'register' | 'login' | 'getUserById'>

export function createAuthController(service: AuthService = authService) {
const register = async (req: Request, res: Response) => {
   try {
      const request = req.body
      if (!request.username || !request.email || !request.password) {
         res.status(400).json({ error: 'Username, email and password are required' })
         return
      }
      const user = await service.register(request.username, request.email, request.password)
      setSessionCookie(res, generateToken({ sub: user.id }))
      res.status(201).json({ user })
   } catch (error: unknown) {
      if ((error as { code?: string }).code === '23505') {
         res.status(409).json({ error: 'An account with this email already exists' })
         return
      }
      console.error('Registration failed', error)
      res.status(500).json({ error: 'Registration failed' })
   }
}

const login = async (req: Request, res: Response) => {
   try {
      const request = req.body
      if (!request.email || !request.password) {
         res.status(400).json({ error: 'Email and password are required' })
         return
      }
      const user = await service.login(request.email, request.password)
      setSessionCookie(res, generateToken({ sub: user.id }))
      res.json({ user })
   } catch {
      res.status(401).json({ error: 'Invalid email or password' })
   }
}

const me = async (req: Request, res: Response) => {
   const user = await service.getUserById((req as AuthenticatedRequest).auth.userId)
   if (!user) {
      res.status(401).json({ error: 'Authentication required' })
      return
   }
   res.json({ user })
}

const logout = (_req: Request, res: Response) => {
   clearAuthCookies(res)
   res.json({ success: true })
}

return { register, login, me, logout }
}

export const { register, login, me, logout } = createAuthController()
