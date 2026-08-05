const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
let csrfToken: string | null = null
let csrfRequest: Promise<string> | null = null

export class ApiError extends Error {
   constructor(message: string, public readonly status: number) {
      super(message)
   }
}

async function fetchCsrfToken(): Promise<string> {
   if (csrfToken) return csrfToken
   if (csrfRequest) return csrfRequest

   csrfRequest = fetch(`${API_URL}/auth/csrf`, { credentials: 'include' })
      .then(async (response) => {
         const body = (await response.json().catch(() => ({}))) as { csrfToken?: string; error?: string }
         if (!response.ok || !body.csrfToken) {
            throw new ApiError(body.error ?? 'Unable to initialize request security', response.status)
         }
         csrfToken = body.csrfToken
         return body.csrfToken
      })
      .finally(() => {
         csrfRequest = null
      })

   return csrfRequest
}

export function clearCsrfToken() {
   csrfToken = null
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
   const method = (init.method ?? 'GET').toUpperCase()
   const headers = new Headers(init.headers)

   if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
   }
   if (!SAFE_METHODS.has(method)) {
      headers.set('X-CSRF-Token', await fetchCsrfToken())
   }

   const response = await fetch(`${API_URL}${path}`, {
      ...init,
      method,
      credentials: 'include',
      headers,
   })
   const body = (await response.json().catch(() => ({}))) as { error?: string; message?: string }
   if (!response.ok) {
      if (response.status === 403 && !SAFE_METHODS.has(method)) clearCsrfToken()
      throw new ApiError(body.error ?? body.message ?? 'Request failed', response.status)
   }
   return body as T
}
