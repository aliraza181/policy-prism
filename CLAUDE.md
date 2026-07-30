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
├── domain/      # Entities, Value Objects, repository INTERFACES, domain services
├── app/         # Use-cases (Application Services), Results, DTOs
├── infra/       # Adapters: Neo4j repos, config, logger - implements domain/app ports
└── web/         # HTTP transport only - routes/controllers, no business logic
```

See the README in each `src/*` folder for that layer's specific rules.

## Non-negotiables (enforced by ESLint, not just convention)

- `neo4j-driver` is imported **only** inside `src/infra/neo4j/`.
- `express` is imported **only** inside `src/web/`.
- `domain/` never imports from `app/`, `infra/`, or `web/`.
- Expected failures (not found, validation error, already exists) are
  returned as `Result.err(...)`, never thrown.

## Development workflow

This repo is part of the Policy Prism workspace (`../policyPrism/`). When
developing features, follow the workflow in `../policyPrism/harness/workflow.md`.
Feature specs are stored in `../policyPrism/harness/features/`.
