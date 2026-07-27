# Domain

The innermost layer. Entities, Value Objects, Repository **interfaces** (not
implementations), domain services, and domain exceptions — organized one
folder per aggregate.

Rules for this layer:

- **No imports from `app/`, `infra/`, or `web/`.** This layer knows nothing
  about Neo4j, Express, HTTP, or any other outer-ring detail — not even
  their names.
- **Entities protect their own invariants.** Validate on creation, throw on
  a bad state, re-validate on every state-changing method. Use a private
  constructor + static factory so an invalid instance can never exist.
- **Value Objects replace primitives.** Prefer `Citation` over `string`,
  `Modality` over a bare string union, where the type itself guarantees
  validity.
- **Repository interfaces live here; implementations live in `infra/`.**
  e.g. `ProvisionRepository` (interface) here, `Neo4jProvisionRepository`
  (implementation) in `src/infra/neo4j/`.

## Aggregates in this project

- `provision/` — the citable regulatory text tree (section → subsection →
  paragraph → subparagraph → clause), populated by the Python pipeline.
- `normative-statement/` — the AI-derived actor/modality/action/object
  decomposition of a Provision.
- `regulatory-instrument/` — the source document a Provision tree belongs
  to (e.g. "42 CFR Part 482").
- `shared/` — cross-aggregate value objects (`Posture`, `Result`, base
  domain exceptions) that don't belong to one aggregate alone.

See the `carbonteq-engineering` skill (`backend-architecture.md`) for the
full DDD building-block glossary (Entity, Value Object, Aggregate,
Repository, Domain Service) before adding new domain code here.
