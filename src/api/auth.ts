import type { AuthResponse, LoginRequest, RawAuthResponse, RegisterRequest } from '@/types/auth'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const requestAuth = async (path: string, body: LoginRequest | RegisterRequest): Promise<AuthResponse> => {
   const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
   })

   const data = (await response.json()) as RawAuthResponse

   if (!response.ok) {
      throw new Error(data.error ?? data.message ?? 'Authentication request failed')
   }

   const user = data.user ?? data.safeUser

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
