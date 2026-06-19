import { Request, Response } from 'express'
import * as authService from './auth.service'

export async function register(req: Request, res: Response) {
   try {
      const request = req.body;
      const result = await authService.register(request.username, request.email, request.password)
      res.json(result)
   } catch (error) {
      res.status(400).json({ error })
   }
}

export async function login(req: Request, res: Response) {
   try {
      const request = req.body;
      const result = await authService.login(request.email, request.password)
      res.json(result)
   } catch (error) {
      res.status(400).json({ error })
   }
}