# policy-prism-catalogue-service

This service must follow **Carbonteq's engineering standards** for every change:
Clean Architecture + DDD layering, `Result`-based error handling, wrapped
third-party SDKs, and the general naming/function/testing practices. Load the
`carbonteq-engineering` skill before writing or reviewing code here, even if
not explicitly asked to follow "best practices."

## What this service is

The read-side Clean Architecture API over the Policy Prism regulatory
knowledge graph — facets, search, provision detail, normative statements.
It **reads** a Neo4j graph populated by a separate Python pipeline (repo:
`policyPrism`); it does not populate that graph itself.

## Layout

```
src/
├── shared/          # Result<T,E>, base error types - the framework-free kernel every layer can import
├── domain/          # entities/, errors/, repositories/ (interfaces), ports/ (interfaces), services/ (pure logic), types/
├── application/      # services/ (use-cases), dtos/ (Zod schema + inferred type), validate.ts
├── infrastructure/   # repositories/ (Neo4j), external-services/ (HTTP proxies), database/, config/, logging/
└── http/             # routes/, controllers/, middleware/, app.ts - transport only, no business logic
```

Each layer folder is organized **by technical role, not by feature slice**
(e.g. all entities in `domain/entities/`, not `domain/provision/provision.entity.ts`) -
a deliberate flat-by-type layout. Filenames stay unique across the whole tree
so this never collides. See the README in each `src/*` folder for that
layer's specific rules.

## Non-negotiables (enforced by ESLint, not just convention)

- `neo4j-driver` is imported **only** inside `src/infrastructure/repositories/`
  and `src/infrastructure/database/`.
- `express` is imported **only** inside `src/http/`.
- `domain/` never imports from `application/`, `infrastructure/`, or `http/`.
- Expected failures (not found, validation error, already exists) are
  returned as `Result.err(...)`, never thrown.

## Development workflow

This repo is part of the Policy Prism workspace (`../policyPrism/`). When
developing features, follow the workflow in `../policyPrism/harness/workflow.md`.
Feature specs are stored in `../policyPrism/harness/features/`.
