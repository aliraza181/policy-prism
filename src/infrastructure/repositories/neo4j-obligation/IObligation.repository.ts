import type { Result } from "../../../shared/result.ts";
import type { ObligationNotFoundError } from "../../../shared/errors.ts";
import type { Obligation } from "../../../domain/entities/obligation.entity.ts";

export interface ObligationListQuery {
  hospitalProfileId: string;
  decision?: string | undefined;
  page: number;
  pageSize: number;
}

export interface ObligationListResult {
  items: Obligation[];
  total: number;
}

export interface SubmitObligationReview {
  obligationId: string;
  verdict: "confirmed" | "overridden";
  overrideDecision: string | undefined;
  note: string | undefined;
  reviewerName: string;
}

export interface IObligationRepository {
  listByHospitalProfile(query: ObligationListQuery): Promise<ObligationListResult>;
  submitReview(input: SubmitObligationReview): Promise<Result<Obligation, ObligationNotFoundError>>;
}
