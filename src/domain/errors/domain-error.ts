/**
 * Thrown only for invariant violations (a bug: reconstituting an entity
 * from data that should never have been persisted in that shape). Ordinary
 * "not found" and "invalid input" outcomes are Result.err(NotFoundError) /
 * Result.err(ValidationError) (shared/errors.ts) - neither is this.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
