import { Result } from "../../shared/result.ts";
import type { ObligationNotFoundError } from "../../shared/errors.ts";
import type { Obligation } from "../../domain/entities/obligation.entity.ts";
import type { IObligationRepository } from "../../infrastructure/repositories/neo4j-obligation/IObligation.repository.ts";
import type { SubmitObligationReviewDto } from "./submit-obligation-review.dto.ts";

export class SubmitObligationReviewUseCase {
  constructor(private readonly obligations: IObligationRepository) {}

  async execute(input: SubmitObligationReviewDto): Promise<Result<Obligation, ObligationNotFoundError>> {
    return this.obligations.submitReview({
      obligationId: input.obligationId,
      verdict: input.verdict,
      overrideDecision: input.overrideDecision,
      note: input.note,
      reviewerName: input.reviewerName,
    });
  }
}
