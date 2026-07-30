# Domain

The innermost layer. Entities, repository **interfaces** (not
implementations), external-capability **ports** (also interfaces), domain
services, domain errors, and plain domain types — organized one folder per
technical role, not per aggregate (a deliberate flat-by-type layout; see the
root `CLAUDE.md` for why).

- `entities/` — rich, invariant-protecting objects. Private constructor +
  `static reconstitute()`, so an invalid instance can never exist.
- `errors/` — `DomainError` (thrown only for invariant violations — a bug)
  plus one `*NotFoundError` subclass of `shared/errors.ts`'s `NotFoundError`
  per aggregate (`ProvisionNotFoundError`, `PolicyNotFoundError`, ...).
- `repositories/` — repository interfaces only. Implementations live in
  `infrastructure/repositories/` (e.g. `Neo4jProvisionRepository`).
- `ports/` — the same idea as repositories but for non-database external
  capabilities: `Logger`, `RagService`, `PolicyPipelineService`.
  Implementations live in `infrastructure/logging/` and
  `infrastructure/external-services/`.
- `services/` — pure domain logic with zero framework/I/O dependencies
  (e.g. `resolveReviewTransition()` — verdict → coverage-edge state, no
  Neo4j call inside it).
- `types/` — plain data shapes and enums with no behavior (`Posture`,
  `CoverageEdge`, `Gap`, ...).

Rules for this layer:

- **No imports from `application/`, `infrastructure/`, or `http/`.** This
  layer knows nothing about Neo4j, Express, HTTP, or any other outer-ring
  detail — not even their names. `Result` and the base error types live in
  the top-level `shared/`, a sibling of `domain/`, specifically so this
  layer never has to reach into an outer layer just to return an outcome.

See the `carbonteq-engineering` skill (`backend-architecture.md`) for the
full DDD building-block glossary (Entity, Value Object, Aggregate,
Repository, Domain Service) before adding new domain code here.
