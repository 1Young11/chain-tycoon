import jwt from 'jsonwebtoken';
import type { Payload } from './jwt.type';

const getJwtSecret = () => {
   const secret = process.env.JWT_SECRET
   if (!secret) throw new Error('JWT_SECRET is not configured')
   return secret
}

export const generateToken = (user: Payload): string => {
   const token = jwt.sign(user, getJwtSecret(), { expiresIn: '1h' });
   return token;
} 

export const verifyToken = (token: string): Payload | null => {
   try {
      const isValidUser = jwt.verify(token, getJwtSecret());
      return isValidUser as Payload
   } catch {
      return null
   }
}
