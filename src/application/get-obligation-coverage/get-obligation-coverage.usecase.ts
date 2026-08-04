import type { Result } from "../../shared/result.ts";
import type { ICoverageReviewRepository } from "../../infrastructure/repositories/neo4j-coverage-review/ICoverageReview.repository.ts";
import type { ObligationCoverageResult } from "../../domain/types/obligation-coverage-result.ts";
import type { NormativeStatementNotFoundError } from "../../shared/errors.ts";
import type { GetObligationCoverageDto } from "./get-obligation-coverage.dto.ts";

export class GetObligationCoverageUseCase {
  constructor(private readonly coverageReviews: ICoverageReviewRepository) {}

  async execute(
    input: GetObligationCoverageDto,
  ): Promise<Result<ObligationCoverageResult, NormativeStatementNotFoundError>> {
    return this.coverageReviews.findByNormativeStatementId(input.normativeStatementId);
  }
}
