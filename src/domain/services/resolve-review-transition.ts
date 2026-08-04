import type { MismatchReasonCategory } from "../types/coverage-edge.ts";
import type { ReviewVerdict } from "../../infrastructure/repositories/neo4j-coverage-review/ICoverageReview.repository.ts";

export interface ReviewTransition {
  /** null means "leave edge_type as the pipeline classified it". */
  edgeType: string | null;
  humanReviewerSignoff: boolean;
}

/**
 * Pure mapping from a reviewer's verdict to the resulting edge state -
 * kept independent of Neo4j/Cypher so it's testable on its own and the
 * infra adapter stays a dumb translator.
 *
 * Confirm never rewrites edge_type (the reviewer is vouching for the
 * pipeline's own classification, not replacing it). A flagged mismatch
 * degrades the edge - to `contradicts` when the reviewer's own reason is
 * a contradiction, otherwise `partially_satisfies` - matching the design
 * decisions log's "honest degradation" rule. An ambiguous flag changes
 * nothing about edge_type; it only routes the mapping to a second
 * reviewer, so the pill upstream must not move on one person's
 * uncertainty.
 */
export function resolveReviewTransition(
  verdict: ReviewVerdict,
  reasonCategory: MismatchReasonCategory | undefined,
): ReviewTransition {
  if (verdict === "confirmed") {
    return { edgeType: null, humanReviewerSignoff: true };
  }
  if (verdict === "flagged_mismatch") {
    return {
      edgeType: reasonCategory === "contradicts_obligation" ? "contradicts" : "partially_satisfies",
      humanReviewerSignoff: false,
    };
  }
  return { edgeType: null, humanReviewerSignoff: false };
}
