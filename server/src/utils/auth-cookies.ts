import type { CookieOptions, Response } from 'express'
import { SESSION_TTL_SECONDS } from './jwt'

export const SESSION_COOKIE_NAME = 'chain_tycoon_session'
export const CSRF_COOKIE_NAME = 'chain_tycoon_csrf'

const isProduction = () => process.env.NODE_ENV === 'production'

export const sessionCookieOptions = (): CookieOptions => ({
   httpOnly: true,
   sameSite: 'lax',
   secure: isProduction(),
   path: '/',
   maxAge: SESSION_TTL_SECONDS * 1000,
})

export const csrfCookieOptions = (): CookieOptions => ({
   httpOnly: false,
   sameSite: 'lax',
   secure: isProduction(),
   path: '/',
})

export function setSessionCookie(res: Response, token: string) {
   res.cookie(SESSION_COOKIE_NAME, token, sessionCookieOptions())
}

export function clearAuthCookies(res: Response) {
   const { maxAge: _maxAge, ...sessionClearOptions } = sessionCookieOptions()
   res.clearCookie(SESSION_COOKIE_NAME, sessionClearOptions)
   res.clearCookie(CSRF_COOKIE_NAME, csrfCookieOptions())
}
