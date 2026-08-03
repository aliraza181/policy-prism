import type { Result } from "../../shared/result.ts";
import type { CoverageReviewRepository } from "../../domain/repositories/coverage-review.repository.ts";
import type { ObligationCoverageResult } from "../../domain/types/obligation-coverage-result.ts";
import type { NormativeStatementNotFoundError } from "../../shared/errors.ts";
import type { GetObligationCoverageDto } from "../../domain/schemas/get-obligation-coverage.schema.ts";

export class GetObligationCoverageUseCase {
  constructor(private readonly coverageReviews: CoverageReviewRepository) {}

  async execute(
    input: GetObligationCoverageDto,
  ): Promise<Result<ObligationCoverageResult, NormativeStatementNotFoundError>> {
    return this.coverageReviews.findByNormativeStatementId(input.normativeStatementId);
  }
}
