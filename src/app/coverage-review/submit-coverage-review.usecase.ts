import { Result } from "../../domain/shared/result.js";
import type { ValidationError } from "../shared/errors.js";
import type { CoverageEdge } from "../../domain/policy/coverage-edge.js";
import type { CoverageReviewRepository } from "../../domain/coverage-review/coverage-review.repository.js";
import type { CoverageEdgeNotFoundError } from "../../domain/coverage-review/coverage-review.errors.js";
import { resolveReviewTransition } from "../../domain/coverage-review/resolve-review-transition.js";
import { submitCoverageReviewSchema } from "./dto/submit-coverage-review.dto.js";
import { validate } from "../shared/validate.js";

export class SubmitCoverageReviewUseCase {
  constructor(private readonly coverageReviews: CoverageReviewRepository) {}

  async execute(
    input: unknown,
  ): Promise<Result<CoverageEdge, ValidationError | CoverageEdgeNotFoundError>> {
    const validated = validate(submitCoverageReviewSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const { edgeId, verdict, reasonCategory, note, reviewerName } = validated.value;
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
