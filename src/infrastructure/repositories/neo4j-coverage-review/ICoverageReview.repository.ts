import type { Result } from "../../../shared/result.ts";
import type { CoverageEdge, MismatchReasonCategory } from "../../../domain/types/coverage-edge.ts";
import type { NormativeStatementNotFoundError, CoverageEdgeNotFoundError } from "../../../shared/errors.ts";
import type { ObligationCoverageResult } from "../../../domain/types/obligation-coverage-result.ts";

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

export interface ICoverageReviewRepository {
  findByNormativeStatementId(
    normativeStatementId: string,
  ): Promise<Result<ObligationCoverageResult, NormativeStatementNotFoundError>>;
  submitReview(input: SubmitCoverageReviewInput): Promise<Result<CoverageEdge, CoverageEdgeNotFoundError>>;
}
