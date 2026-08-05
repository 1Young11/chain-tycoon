import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'
import { apiRequest, clearCsrfToken } from './client'

const requestAuth = async (path: string, body: LoginRequest | RegisterRequest): Promise<AuthResponse> => {
   const data = await apiRequest<AuthResponse>(path, {
      method: 'POST',
      body: JSON.stringify(body),
   })

   if (!data.user) {
      throw new Error('Invalid authentication response')
   }
   return data
}

export const register = (payload: RegisterRequest) => requestAuth('/auth/register', payload)

export const login = (payload: LoginRequest) => requestAuth('/auth/login', payload)

export const getCurrentUser = () => apiRequest<AuthResponse>('/auth/me')

export const logout = async () => {
   try {
      await apiRequest<{ success: true }>('/auth/logout', { method: 'POST' })
   } finally {
      clearCsrfToken()
   }
}
