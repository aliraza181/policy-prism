export type ObligationOverrideDecision = "applies" | "supports" | "not_applicable" | "needs_review";

export interface SubmitObligationReviewDto {
  obligationId: string;
  verdict: "confirmed" | "overridden";
  overrideDecision?: ObligationOverrideDecision | undefined;
  note?: string | undefined;
  reviewerName: string;
}
