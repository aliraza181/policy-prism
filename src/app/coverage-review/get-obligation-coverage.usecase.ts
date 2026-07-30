import { Result } from "../../domain/shared/result.js";
import type { ValidationError } from "../shared/errors.js";
import type { CoverageReviewRepository } from "../../domain/coverage-review/coverage-review.repository.js";
import type { ObligationCoverageResult } from "../../domain/coverage-review/obligation-coverage-result.js";
import type { NormativeStatementNotFoundError } from "../../domain/normative-statement/normative-statement.errors.js";
import { getObligationCoverageSchema } from "./dto/get-obligation-coverage.dto.js";
import { validate } from "../shared/validate.js";

export class GetObligationCoverageUseCase {
  constructor(private readonly coverageReviews: CoverageReviewRepository) {}

  async execute(
    input: unknown,
  ): Promise<Result<ObligationCoverageResult, ValidationError | NormativeStatementNotFoundError>> {
    const validated = validate(getObligationCoverageSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    return this.coverageReviews.findByNormativeStatementId(validated.value.normativeStatementId);
  }
}
