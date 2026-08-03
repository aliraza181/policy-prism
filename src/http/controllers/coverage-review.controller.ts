import type { Request, Response } from "express";

import type { GetObligationCoverageUseCase } from "../../application/services/get-obligation-coverage.usecase.ts";
import type { SubmitCoverageReviewUseCase } from "../../application/services/submit-coverage-review.usecase.ts";
import type { GetObligationCoverageDto } from "../../domain/schemas/get-obligation-coverage.schema.ts";
import type { SubmitCoverageReviewDto } from "../../domain/schemas/submit-coverage-review.schema.ts";
import { sendResult } from "../result-to-response.ts";

export class CoverageReviewController {
  constructor(
    private readonly getObligationCoverage: GetObligationCoverageUseCase,
    private readonly submitCoverageReview: SubmitCoverageReviewUseCase,
  ) {}

  getObligationCoverageHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as GetObligationCoverageDto;
    const input: GetObligationCoverageDto = { normativeStatementId: validated.normativeStatementId };
    const result = await this.getObligationCoverage.execute(input);
    sendResult(res, result);
  };

  submitReviewHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as SubmitCoverageReviewDto;
    const input: SubmitCoverageReviewDto = {
      edgeId: validated.edgeId,
      verdict: validated.verdict,
      reasonCategory: validated.reasonCategory,
      note: validated.note,
      reviewerName: validated.reviewerName,
    };
    const result = await this.submitCoverageReview.execute(input);
    sendResult(res, result);
  };
}
