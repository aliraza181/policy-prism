import type { Result } from "../../shared/result.ts";
import type { CoverageEdge } from "../../domain/types/coverage-edge.ts";
import type { ICoverageReviewRepository } from "../../infrastructure/repositories/neo4j-coverage-review/ICoverageReview.repository.ts";
import type { CoverageEdgeNotFoundError } from "../../shared/errors.ts";
import { resolveReviewTransition } from "../../domain/services/resolve-review-transition.ts";
import type { SubmitCoverageReviewDto } from "./submit-coverage-review.dto.ts";

export class SubmitCoverageReviewUseCase {
  constructor(private readonly coverageReviews: ICoverageReviewRepository) {}

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
