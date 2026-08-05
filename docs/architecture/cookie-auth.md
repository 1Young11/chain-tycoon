# Cookie authentication baseline

Chain Tycoon uses its existing one-hour JWT as a stateless session token. The backend stores it only in the `chain_tycoon_session` HttpOnly cookie; browser JavaScript never receives or persists the JWT. New JWT payloads contain only `sub`, and protected handlers load current data from PostgreSQL when needed.

The session cookie is `HttpOnly`, `SameSite=Lax`, scoped to `/`, and `Secure` in production. It has no explicit domain and its one-hour lifetime matches the JWT. Logout clears the browser cookie with the same scope. Because this MVP has no server-side session store or revocation list, logout does not revoke a copied token before its expiry.

Unsafe requests use signed double-submit CSRF protection. `GET /auth/csrf` returns a random token with `Cache-Control: no-store` and sets `chain_tycoon_csrf` to the token plus an HMAC generated with the independent `CSRF_SECRET`. The frontend keeps the returned token only in tab memory and sends it as `X-CSRF-Token`. The backend timing-safely compares the header with the cookie token and verifies the HMAC. Missing configuration fails explicitly when CSRF functionality is used; importing the Express app remains side-effect free.

Production frontend and backend deployments must be same-site compatible, normally through a reverse proxy. CORS accepts only the configured `CLIENT_ORIGIN`, enables credentials, and permits the required methods and headers. It never combines credentialed requests with a wildcard origin.
