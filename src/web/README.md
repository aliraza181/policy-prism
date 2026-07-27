# Web

The outermost ring. A thin transport wrapper — HTTP routes/controllers
that turn a valid request into an application-layer DTO, call the
matching use-case in `app/`, and serialize the returned `Result` back out
(`Ok` → 2xx JSON, `Err` → 4xx/5xx with a clear error body).

Rules for this layer:

- **No business logic.** If a route handler is doing anything more
  complex than "parse input → call use-case → serialize result," that
  logic belongs in `app/`, not here.
- **Framework detail stays here.** Express/Fastify (whichever is chosen)
  is imported only in this folder — swapping frameworks should never
  require touching `domain/` or `app/`.

`http/` holds route definitions and controllers, grouped by the same
use-case boundaries as `app/catalogue/`.
