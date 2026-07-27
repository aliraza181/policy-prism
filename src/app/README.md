# Application

Application Services (use-cases), application-level `Result` types, and
DTOs. This is where one user goal gets orchestrated — "search the
catalogue," "get provision detail," "list normative statements for a
provision."

Rules for this layer:

- **Depends on `domain/` only** (via repository interfaces and domain
  types). Never imports `infra/` or `web/` directly — dependencies are
  injected (constructor injection), so this layer can be tested against a
  fake repository with no real Neo4j connection.
- **Returns `Result`, never throws for expected outcomes.** "Provision not
  found" is an ordinary outcome, not an exception — model it as
  `Result.err(ProvisionNotFoundError)`.
- **DTOs are where input validation lives** (first line of defense,
  Notification pattern — collect every validation error, don't stop at the
  first). Flat, data-oriented, no business logic — validation lives in the
  DTO, business rules live in `domain/`.
- **This layer doesn't know or care how the request arrived** — HTTP, CLI,
  or a test harness all look the same from here: a valid DTO in, a
  `Result` out.

## Use-cases in this project (`catalogue/`)

The read-side API the Policy Library UI will call:

- Facets — counts of provisions/statements by category, source, modality.
- Search — hybrid keyword + semantic (vector) search over provisions.
- Provision detail — one provision's full text + its normative statements.
- Normative statements for a provision.

`shared/` holds the application-level `Result` type and any DTO base
types reused across use-cases.
