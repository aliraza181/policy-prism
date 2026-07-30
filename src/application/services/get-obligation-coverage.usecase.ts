import type { Result } from "../../shared/result.js";
import type { CoverageReviewRepository } from "../../domain/repositories/coverage-review.repository.js";
import type { ObligationCoverageResult } from "../../domain/types/obligation-coverage-result.js";
import type { NormativeStatementNotFoundError } from "../../domain/errors/normative-statement.errors.js";
import type { GetObligationCoverageDto } from "../dtos/get-obligation-coverage.dto.js";

export class GetObligationCoverageUseCase {
  constructor(private readonly coverageReviews: CoverageReviewRepository) {}

  async execute(
    input: GetObligationCoverageDto,
  ): Promise<Result<ObligationCoverageResult, NormativeStatementNotFoundError>> {
    return this.coverageReviews.findByNormativeStatementId(input.normativeStatementId);
  }
}
