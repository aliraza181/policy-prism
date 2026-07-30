import type { Request, Response } from "express";

import type { GetObligationCoverageUseCase } from "../../application/services/get-obligation-coverage.usecase.js";
import type { SubmitCoverageReviewUseCase } from "../../application/services/submit-coverage-review.usecase.js";
import { sendResult } from "../result-to-response.js";

export class CoverageReviewController {
  constructor(
    private readonly getObligationCoverage: GetObligationCoverageUseCase,
    private readonly submitCoverageReview: SubmitCoverageReviewUseCase,
  ) {}

  getObligationCoverageHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.getObligationCoverage.execute({
      normativeStatementId: req.params.normativeStatementId,
    });
    sendResult(res, result);
  };

  submitReviewHandler = async (req: Request, res: Response): Promise<void> => {
    const body = req.body as Record<string, unknown>;
    const result = await this.submitCoverageReview.execute({ ...body, edgeId: req.params.edgeId });
    sendResult(res, result);
  };
}
