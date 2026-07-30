/**
 * Thrown only for invariant violations (a bug: reconstituting an entity
 * from data that should never have been persisted in that shape). Ordinary
 * "not found" outcomes are Result.err(NotFoundError) (domain/shared/errors.ts),
 * "invalid input" outcomes are Result.err(ValidationError) (app/shared/errors.ts)
 * - neither is this.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
