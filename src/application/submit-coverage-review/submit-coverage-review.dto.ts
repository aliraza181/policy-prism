export type ReviewVerdict = "confirmed" | "flagged_mismatch" | "flagged_ambiguous";
export type MismatchReasonCategory = "missing_element" | "contradicts_obligation" | "outdated_policy_text";

export interface SubmitCoverageReviewDto {
  edgeId: string;
  verdict: ReviewVerdict;
  reasonCategory?: MismatchReasonCategory | undefined;
  note?: string | undefined;
  reviewerName: string;
}
