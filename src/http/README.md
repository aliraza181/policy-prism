# HTTP

The outermost ring. A thin transport wrapper — routes/controllers that turn
a valid request into an application-layer DTO, call the matching use case in
`application/services/`, and serialize the returned `Result` back out
(`Ok` → 2xx JSON, `Err` → 4xx/5xx with a clear error body).

- `routes/` — path + method → controller method binding only.
- `controllers/` — parse input, call a use case, serialize the `Result`.
- `middleware/` — `async-handler.ts` (wraps async route handlers so a
  rejected promise reaches Express's error handling instead of hanging).
- `app.ts` — mounts every router; `result-to-response.ts` — the one place
  that maps a `Result`'s `Ok`/`Err` to an HTTP status + JSON body.

Rules for this layer:

- **No business logic.** If a route handler is doing anything more complex
  than "parse input → call use case → serialize result," that logic belongs
  in `application/`, not here.
- **Framework detail stays here.** Express is imported only in this
  folder — swapping frameworks should never require touching `domain/` or
  `application/`.
