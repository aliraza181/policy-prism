# Application

Where one user goal gets orchestrated — "search the catalogue," "upload a
policy," "submit a coverage review verdict."

- `services/` — the use cases (files still named `*.usecase.ts`, classes
  `*UseCase` — the working, unambiguous names this project already used;
  only the folder is renamed to match the `application/services/` layer
  name, not every identifier inside it).
- `dtos/` — Zod schema + its inferred type together in one file per use
  case (this project's existing convention — schema and type are the same
  artifact here, not split into a separate `domain/schemas/` layer).
- `validate.ts` — the shared Notification-pattern validation helper
  (`safeParse` + collect every issue, don't stop at the first).

Rules for this layer:

- **Depends on `domain/` only** (via repository interfaces and domain
  types). Never imports `infrastructure/` or `http/` directly — dependencies
  are injected (constructor injection), so a use case can be tested against
  a fake repository with no real Neo4j connection.
- **Returns `Result`, never throws for expected outcomes.** "Provision not
  found" is an ordinary outcome, not an exception — model it as
  `Result.err(new ProvisionNotFoundError(id))`.
- **DTOs are where input validation lives** (first line of defense). Flat,
  data-oriented, no business logic — validation lives in the DTO, business
  rules live in `domain/`.
- **This layer doesn't know or care how the request arrived** — HTTP, CLI,
  or a test harness all look the same from here: a valid DTO in, a
  `Result` out.
