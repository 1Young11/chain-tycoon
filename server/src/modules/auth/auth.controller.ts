import { Request, Response } from 'express'
import * as authService from './auth.service'

export async function register(req: Request, res: Response) {
   try {
      const request = req.body
      if (!request.username || !request.email || !request.password) {
         res.status(400).json({ error: 'Username, email and password are required' })
         return
      }
      const result = await authService.register(request.username, request.email, request.password)
      res.status(201).json(result)
   } catch (error: unknown) {
      if ((error as { code?: string }).code === '23505') {
         res.status(409).json({ error: 'An account with this email already exists' })
         return
      }
      console.error('Registration failed', error)
      res.status(500).json({ error: 'Registration failed' })
   }
}

export async function login(req: Request, res: Response) {
   try {
      const request = req.body
      if (!request.email || !request.password) {
         res.status(400).json({ error: 'Email and password are required' })
         return
      }
      const result = await authService.login(request.email, request.password)
      res.json(result)
   } catch {
      res.status(401).json({ error: 'Invalid email or password' })
   }
}
