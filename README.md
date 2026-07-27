# Policy Prism — Catalogue Service

The Clean Architecture TypeScript service that exposes Policy Prism's
regulatory knowledge graph as a browsable, searchable catalogue: facets by
category/source, hybrid keyword + semantic search, provision detail, and
the normative statements extracted from each provision.

This service **reads** a Neo4j graph populated by a separate Python data
pipeline (repo: `policyPrism`). The two projects share a database, not a
codebase — this service never runs ingestion/extraction itself.

## Architecture

Built to [Carbonteq's engineering standards](https://github.com/) (Clean
Architecture + DDD): dependencies point inward, third-party SDKs
(`neo4j-driver`, `express`) are wrapped behind adapters, and expected
failures are modeled as `Result` returns rather than exceptions.

```
src/
├── domain/      # Entities, Value Objects, repository interfaces, domain services
├── app/         # Use-cases, application Results, DTOs
├── infra/       # Neo4j repository adapters, config, logger
└── web/         # HTTP routes/controllers - thin transport layer only
```

See `CLAUDE.md` and the README in each `src/*` subfolder before adding code.

## Status

Repository structure only — no business logic implemented yet. Next steps:
domain entities for `Provision` and `NormativeStatement`, their repository
interfaces, and a first use-case (`GetProvisionDetail`) with a Neo4j-backed
implementation.

## Setup

```bash
npm install
cp .env.example .env   # fill in the same Neo4j credentials as the pipeline repo
npm run dev
```
