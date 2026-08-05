import type { NextFunction, Request, Response } from 'express'

export type RequestWithCookies = Request & { cookies: Record<string, string> }

export function parseCookieHeader(header: string | undefined): Record<string, string> {
   if (!header) return {}

   return header.split(';').reduce<Record<string, string>>((cookies, part) => {
      const separator = part.indexOf('=')
      if (separator < 1) return cookies

      const name = part.slice(0, separator).trim()
      const value = part.slice(separator + 1).trim()
      try {
         cookies[name] = decodeURIComponent(value)
      } catch {
         cookies[name] = value
      }
      return cookies
   }, {})
}

export function cookiesMiddleware(req: Request, _res: Response, next: NextFunction) {
   ;(req as RequestWithCookies).cookies = parseCookieHeader(req.header('cookie'))
   next()
}
