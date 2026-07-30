import type { Result } from "../../shared/result.js";
import type { CoverageEdge } from "../../domain/types/coverage-edge.js";
import type { CoverageReviewRepository } from "../../domain/repositories/coverage-review.repository.js";
import type { CoverageEdgeNotFoundError } from "../../domain/errors/coverage-review.errors.js";
import { resolveReviewTransition } from "../../domain/services/resolve-review-transition.js";
import type { SubmitCoverageReviewDto } from "../dtos/submit-coverage-review.dto.js";

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
