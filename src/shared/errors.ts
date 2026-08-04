export abstract class AppError {
  abstract readonly kind: string;
  constructor(readonly message: string) {}
}

export class NotFoundError extends AppError {
  readonly kind = "not_found";
  constructor(
    readonly resource: string,
    readonly id: string,
  ) {
    super(`${resource} not found: ${id}`);
  }
}

export class ValidationError extends AppError {
  readonly kind = "validation_error";
  constructor(readonly issues: string[]) {
    super(`Validation failed: ${issues.join("; ")}`);
  }
}

export class ProvisionNotFoundError extends NotFoundError {
  constructor(id: string) { super("Provision", id); }
}

export class PolicyNotFoundError extends NotFoundError {
  constructor(id: string) { super("Policy", id); }
}

export class PolicyIntakeJobNotFoundError extends NotFoundError {
  constructor(id: string) { super("PolicyIntakeJob", id); }
}

export class AssessmentRunNotFoundError extends NotFoundError {
  constructor(id: string) { super("AssessmentRun", id); }
}

export class CoverageEdgeNotFoundError extends NotFoundError {
  constructor(id: string) { super("CoverageEdge", id); }
}

export class NormativeStatementNotFoundError extends NotFoundError {
  constructor(id: string) { super("NormativeStatement", id); }
}

export class HospitalProfileNotFoundError extends NotFoundError {
  constructor(id: string) { super("HospitalProfile", id); }
}

export class ObligationNotFoundError extends NotFoundError {
  constructor(id: string) { super("Obligation", id); }
}
