import { AppError } from "../../domain/shared/errors.js";

export class ValidationError extends AppError {
  readonly kind = "validation_error";
  constructor(readonly issues: string[]) {
    super(`Validation failed: ${issues.join("; ")}`);
  }
}
