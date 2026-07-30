export type ReviewStatus = "pending" | "confirmed" | "flagged_mismatch" | "flagged_ambiguous";

export type MismatchReasonCategory =
  | "missing_element"
  | "contradicts_obligation"
  | "outdated_policy_text";

export interface CoverageEdge {
  id: string;
  sectionId: string;
  sectionRef: string;
  normativeStatementId: string;
  normativeStatementText: string;
  edgeType: string;
  explanation: string;
  policyTextMatch: string;
  evidenceMatch: string;
  confidence: number;
  matchType: string;
  humanReviewerSignoff: boolean;
  requiresReview: boolean;
  reviewStatus: ReviewStatus;
  reasonCategory: MismatchReasonCategory | null;
  reviewNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
}
