# Infrastructure

Not a layer of its own — this is where every **adapter** lives: concrete
implementations of the ports/repositories defined in `domain/`. Expected to
change often; should be the easiest ring to swap.

- `repositories/` — implements the domain repository interfaces
  (`ProvisionRepository`, `NormativeStatementRepository`, ...) against the
  same Neo4j graph the Python pipeline populates. **The `neo4j-driver`
  package is imported only inside this folder and `database/`** — nowhere
  else in the codebase.
- `external-services/` — HTTP proxy adapters implementing `domain/ports/`
  interfaces (`RagService`, `PolicyPipelineService`) against the separate
  Python microservice, not a database.
- `database/` — the Neo4j driver/session plumbing (`driver.ts`,
  `session.ts`) that `repositories/` sits on top of.
- `config/` — environment/config loading (connection strings, secrets).
  Read once here; the rest of the app receives already-parsed config
  objects, never raw `process.env` reads scattered around.
- `logging/` — the logging adapter for the `Logger` port
  (`domain/ports/logger.ts`).

## Why this boundary matters here specifically

The Python pipeline (separate repo) and this service share a **database**,
not a **codebase**. This service's only contract with that data is:
whatever shape the pipeline wrote into Neo4j. If the pipeline's node/
property shape changes, exactly one thing here — the relevant repository
adapter in `repositories/` — should need to change, never the domain or
application layers.
