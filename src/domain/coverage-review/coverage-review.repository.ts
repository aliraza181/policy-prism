import type { Result } from "../shared/result.js";
import type { CoverageEdge, MismatchReasonCategory } from "../policy/coverage-edge.js";
import type { NormativeStatementNotFoundError } from "../normative-statement/normative-statement.errors.js";
import type { CoverageEdgeNotFoundError } from "./coverage-review.errors.js";
import type { ObligationCoverageResult } from "./obligation-coverage-result.js";

export type ReviewVerdict = "confirmed" | "flagged_mismatch" | "flagged_ambiguous";

export interface SubmitCoverageReviewInput {
  edgeId: string;
  verdict: ReviewVerdict;
  reasonCategory: MismatchReasonCategory | undefined;
  note: string | undefined;
  reviewerName: string;
  /** null means "leave edge_type as the pipeline classified it" - resolved by resolveReviewTransition(). */
  edgeType: string | null;
  humanReviewerSignoff: boolean;
}

export interface CoverageReviewRepository {
  findByNormativeStatementId(
    normativeStatementId: string,
  ): Promise<Result<ObligationCoverageResult, NormativeStatementNotFoundError>>;
  submitReview(input: SubmitCoverageReviewInput): Promise<Result<CoverageEdge, CoverageEdgeNotFoundError>>;
}
