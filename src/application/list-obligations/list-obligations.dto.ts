export type ObligationDecisionFilter = "applies" | "supports" | "not_applicable" | "needs_review";

export interface ListObligationsDto {
  hospitalProfileId: string;
  decision?: ObligationDecisionFilter | undefined;
  page: number;
  pageSize: number;
}
