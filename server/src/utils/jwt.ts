import jwt from 'jsonwebtoken';
import type { Payload } from './jwt.type';

const JWT_SECRET = process.env.JWT_SECRET as string

export const generateToken = (user: Payload): string => {
   const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
   return token;
} 

export const verifyToken = (token: string): Payload | null => {
   try {
      const isValidUser = jwt.verify(token, JWT_SECRET);
      return isValidUser as Payload
   } catch {
      return null
   }
}