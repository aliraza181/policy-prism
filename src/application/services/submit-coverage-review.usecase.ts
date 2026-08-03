import type { Result } from "../../shared/result.ts";
import type { CoverageEdge } from "../../domain/types/coverage-edge.ts";
import type { CoverageReviewRepository } from "../../domain/repositories/coverage-review.repository.ts";
import type { CoverageEdgeNotFoundError } from "../../shared/errors.ts";
import { resolveReviewTransition } from "../../domain/services/resolve-review-transition.ts";
import type { SubmitCoverageReviewDto } from "../../domain/schemas/submit-coverage-review.schema.ts";

export class SubmitCoverageReviewUseCase {
  constructor(private readonly coverageReviews: CoverageReviewRepository) {}

  async execute(input: SubmitCoverageReviewDto): Promise<Result<CoverageEdge, CoverageEdgeNotFoundError>> {
    const { edgeId, verdict, reasonCategory, note, reviewerName } = input;
    const transition = resolveReviewTransition(verdict, reasonCategory);
    return this.coverageReviews.submitReview({
      edgeId,
      verdict,
      reasonCategory,
      note,
      reviewerName,
      edgeType: transition.edgeType,
      humanReviewerSignoff: transition.humanReviewerSignoff,
    });
  }
}
