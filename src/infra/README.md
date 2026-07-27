# Infrastructure

Not a layer of its own — this is where every **adapter** lives: concrete
implementations of the ports (interfaces) defined in `domain/` and `app/`.
Expected to change often; should be the easiest ring to swap.

- `neo4j/` — implements the domain repository interfaces
  (`ProvisionRepository`, `NormativeStatementRepository`, ...) against the
  same Neo4j graph the Python pipeline populates. **The `neo4j` driver
  package is imported only inside this folder** — nowhere else in the
  codebase.
- `config/` — environment/config loading (connection strings, secrets).
  Read once here; the rest of the app receives already-parsed config
  objects, never raw `process.env` reads scattered around.
- `logger/` — the logging adapter. Business/application code depends on a
  small `Logger` interface (defined in `app/shared` or `domain/shared`),
  this folder provides the concrete implementation.

## Why this boundary matters here specifically

The Python pipeline (separate repo) and this service share a **database**,
not a **codebase**. This service's only contract with that data is:
whatever shape the pipeline wrote into Neo4j. If the pipeline's node/
property shape changes, exactly one thing here — the relevant repository
adapter in `neo4j/` — should need to change, never the domain or
application layers.
