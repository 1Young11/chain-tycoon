const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const AUTH_TOKEN_KEY = 'chain-tycoon-token'

export class ApiError extends Error {
   constructor(message: string, public readonly status: number) {
      super(message)
   }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
   const token = localStorage.getItem(AUTH_TOKEN_KEY)
   const response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
         'Content-Type': 'application/json',
         ...(token ? { Authorization: `Bearer ${token}` } : {}),
         ...init.headers,
      },
   })
   const body = (await response.json().catch(() => ({}))) as { error?: string; message?: string }
   if (!response.ok) throw new ApiError(body.error ?? body.message ?? 'Request failed', response.status)
   return body as T
}
