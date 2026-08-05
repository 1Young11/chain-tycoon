import type { AuthResponse, LoginRequest, RawAuthResponse, RegisterRequest } from '@/types/auth'
import { apiRequest } from './client'

const requestAuth = async (path: string, body: LoginRequest | RegisterRequest): Promise<AuthResponse> => {
   const data = await apiRequest<RawAuthResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
   })

   const user = data.user

   if (!data.token || !user) {
      throw new Error('Invalid authentication response')
   }

   return {
      token: data.token,
      user,
   }
}

export const register = (payload: RegisterRequest) => requestAuth('/auth/register', payload)

export const login = (payload: LoginRequest) => requestAuth('/auth/login', payload)
