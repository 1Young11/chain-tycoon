const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])
let csrfToken: string | null = null
let csrfRequest: Promise<string> | null = null

interface ResponseBody {
   csrfToken?: string
   error?: string
   message?: string
}

export class ApiError extends Error {
   public readonly status: number

   constructor(message: string, status: number) {
      super(message)
      this.status = status
   }
}

async function readResponseBody(response: Response): Promise<ResponseBody> {
   try {
      return await response.json()
   } catch {
      return {}
   }
}

function getRequestMethod(init: RequestInit): string {
   return (init.method ?? 'GET').toUpperCase()
}

function isSafeMethod(method: string): boolean {
   return SAFE_METHODS.has(method)
}

async function requestNewCsrfToken(): Promise<string> {
   const response = await fetch(`${API_URL}/auth/csrf`, {
      credentials: 'include',
   })

   const body = await readResponseBody(response)

   if (!response.ok || !body.csrfToken) {
      throw new ApiError(
         body.error ?? 'Unable to initialize request security',
         response.status,
      )
   }

   csrfToken = body.csrfToken
   return body.csrfToken
}

async function handleResponse<T>(response: Response, method: string): Promise<T> {
   const body = await readResponseBody(response)

   if (response.ok) {
      return body as T
   }

   if (response.status === 403 && !isSafeMethod(method)) {
      clearCsrfToken()
   }

   throw new ApiError(
      body.error ?? body.message ?? 'Request failed',
      response.status,
   )
}

async function fetchCsrfToken(): Promise<string> {
   if (csrfToken) return csrfToken
   if (csrfRequest) return csrfRequest

   csrfRequest = requestNewCsrfToken().finally(() => {
      csrfRequest = null
   })

   return csrfRequest
}

export function clearCsrfToken() {
   csrfToken = null
}

async function createRequestHeaders(init: RequestInit, method: string): Promise<Headers> {
   const headers = new Headers(init.headers)
   if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
   }

   if (!isSafeMethod(method)) {
      const token = await fetchCsrfToken()
      headers.set('X-CSRF-Token', token)
   }

   return headers
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
   const method = getRequestMethod(init)
   const headers = await createRequestHeaders(init, method)

   const response = await fetch(`${API_URL}${path}`, {
      ...init,
      method,
      credentials: 'include',
      headers,
   })
   return handleResponse<T>(response, method)
}
