import assert from 'node:assert/strict'
import type { AddressInfo } from 'node:net'
import { createServer, type Server } from 'node:http'
import test, { after, before } from 'node:test'
import express from 'express'
import jwt from 'jsonwebtoken'
import app from '../src/app'
import { cookiesMiddleware } from '../src/middleware/cookies.middleware'
import { createCsrfToken, requireCsrf } from '../src/middleware/csrf.middleware'
import { requireAuth, type AuthenticatedRequest } from '../src/middleware/auth.middleware'
import { createAuthController } from '../src/modules/auth/auth.controller'
import {
   CSRF_COOKIE_NAME,
   SESSION_COOKIE_NAME,
   csrfCookieOptions,
   sessionCookieOptions,
} from '../src/utils/auth-cookies'
import { generateToken } from '../src/utils/jwt'

process.env.JWT_SECRET = 'test-only-jwt-secret-with-sufficient-entropy'
process.env.CSRF_SECRET = 'test-only-csrf-secret-with-sufficient-entropy'

let server: Server
let baseUrl: string

const listen = async (expressApp: express.Express) => {
   const httpServer = createServer(expressApp)
   await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve))
   const address = httpServer.address() as AddressInfo
   return { httpServer, url: `http://127.0.0.1:${address.port}` }
}

const close = (httpServer: Server) => new Promise<void>((resolve, reject) => {
   httpServer.close((error) => error ? reject(error) : resolve())
})

const cookiePair = (name: string, value: string) => `${name}=${encodeURIComponent(value)}`

before(async () => {
   const running = await listen(app)
   server = running.httpServer
   baseUrl = running.url
})

after(async () => {
   await close(server)
})

test('GET /auth/csrf returns an uncached token and signed CSRF cookie', async () => {
   const response = await fetch(`${baseUrl}/auth/csrf`)
   const body = await response.json() as { csrfToken: string }
   const setCookie = response.headers.get('set-cookie') ?? ''

   assert.equal(response.status, 200)
   assert.ok(body.csrfToken.length >= 32)
   assert.match(response.headers.get('cache-control') ?? '', /no-store/i)
   assert.match(setCookie, new RegExp(`^${CSRF_COOKIE_NAME}=`))
   assert.match(setCookie, /SameSite=Lax/i)
   assert.match(setCookie, /Path=\//i)
   assert.doesNotMatch(setCookie, /HttpOnly/i)
})

test('CSRF rejects missing, mismatched, and tampered double-submit tokens', async () => {
   const missing = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrong' }),
   })
   assert.equal(missing.status, 403)

   const { token, signedToken } = createCsrfToken()
   const mismatched = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Cookie: cookiePair(CSRF_COOKIE_NAME, signedToken),
         'X-CSRF-Token': `${token}-mismatch`,
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrong' }),
   })
   assert.equal(mismatched.status, 403)

   const tampered = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Cookie: cookiePair(CSRF_COOKIE_NAME, `${token}.invalid-signature`),
         'X-CSRF-Token': token,
      },
      body: JSON.stringify({ email: 'test@example.com', password: 'wrong' }),
   })
   assert.equal(tampered.status, 403)
})

test('auth middleware ignores Bearer tokens and trusts only session-cookie sub', async () => {
   const missingSessionResponse = await fetch(`${baseUrl}/auth/me`)
   assert.equal(missingSessionResponse.status, 401)

   const protectedApp = express()
   protectedApp.use(cookiesMiddleware)
   protectedApp.get('/protected', requireAuth, (req, res) => {
      res.json({ auth: (req as AuthenticatedRequest).auth })
   })
   const running = await listen(protectedApp)

   try {
      const token = generateToken({ sub: 'user-123' })
      const bearerResponse = await fetch(`${running.url}/protected`, {
         headers: { Authorization: `Bearer ${token}` },
      })
      assert.equal(bearerResponse.status, 401)

      const expiredToken = jwt.sign(
         { sub: 'user-123' },
         process.env.JWT_SECRET as string,
         { expiresIn: -1 },
      )
      for (const invalidToken of ['not-a-jwt', expiredToken]) {
         const invalidResponse = await fetch(`${running.url}/protected`, {
            headers: { Cookie: cookiePair(SESSION_COOKIE_NAME, invalidToken) },
         })
         assert.equal(invalidResponse.status, 401)
      }

      const cookieResponse = await fetch(`${running.url}/protected`, {
         headers: { Cookie: cookiePair(SESSION_COOKIE_NAME, token) },
      })
      assert.equal(cookieResponse.status, 200)
      assert.deepEqual(await cookieResponse.json(), { auth: { userId: 'user-123' } })
   } finally {
      await close(running.httpServer)
   }
})

test('cookie security flags are centralized and production-aware', () => {
   const previousEnvironment = process.env.NODE_ENV
   process.env.NODE_ENV = 'production'
   try {
      assert.deepEqual(sessionCookieOptions(), {
         httpOnly: true,
         sameSite: 'lax',
         secure: true,
         path: '/',
         maxAge: 3_600_000,
      })
      assert.deepEqual(csrfCookieOptions(), {
         httpOnly: false,
         sameSite: 'lax',
         secure: true,
         path: '/',
      })
   } finally {
      if (previousEnvironment === undefined) delete process.env.NODE_ENV
      else process.env.NODE_ENV = previousEnvironment
   }
})

test('login/register responses expose only user data and set a hardened session cookie', async () => {
   const user = { id: 'user-123', username: 'player', email: 'player@example.com' }
   const controller = createAuthController({
      register: async () => user,
      login: async () => user,
      getUserById: async () => user,
   })
   const authApp = express()
   authApp.use(express.json(), cookiesMiddleware, requireCsrf)
   authApp.post('/register', controller.register)
   authApp.post('/login', controller.login)
   authApp.get('/me', requireAuth, controller.me)
   const running = await listen(authApp)

   try {
      for (const path of ['register', 'login']) {
         const { token, signedToken } = createCsrfToken()
         const response = await fetch(`${running.url}/${path}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Cookie: cookiePair(CSRF_COOKIE_NAME, signedToken),
               'X-CSRF-Token': token,
            },
            body: JSON.stringify(path === 'register'
               ? { username: 'player', email: user.email, password: 'password' }
               : { email: user.email, password: 'password' }),
         })
         const body = await response.json() as Record<string, unknown>
         const setCookie = response.headers.get('set-cookie') ?? ''

         assert.equal(response.status, path === 'register' ? 201 : 200)
         assert.deepEqual(body, { user })
         assert.equal('token' in body, false)
         assert.match(setCookie, new RegExp(`^${SESSION_COOKIE_NAME}=`))
         assert.match(setCookie, /HttpOnly/i)
         assert.match(setCookie, /SameSite=Lax/i)
         assert.match(setCookie, /Path=\//i)
      }

      const meResponse = await fetch(`${running.url}/me`, {
         headers: { Cookie: cookiePair(SESSION_COOKIE_NAME, generateToken({ sub: user.id })) },
      })
      assert.equal(meResponse.status, 200)
      assert.deepEqual(await meResponse.json(), { user })
   } finally {
      await close(running.httpServer)
   }
})

test('logout requires CSRF and clears both auth cookies', async () => {
   const { token, signedToken } = createCsrfToken()
   const response = await fetch(`${baseUrl}/auth/logout`, {
      method: 'POST',
      headers: {
         Cookie: cookiePair(CSRF_COOKIE_NAME, signedToken),
         'X-CSRF-Token': token,
      },
   })
   const setCookie = response.headers.get('set-cookie') ?? ''

   assert.equal(response.status, 200)
   assert.deepEqual(await response.json(), { success: true })
   assert.match(setCookie, new RegExp(`${SESSION_COOKIE_NAME}=`))
   assert.match(setCookie, new RegExp(`${CSRF_COOKIE_NAME}=`))
   assert.match(setCookie, /Expires=Thu, 01 Jan 1970/i)
})
