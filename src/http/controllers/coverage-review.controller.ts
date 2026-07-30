import type { Request, Response } from "express";

import type { GetObligationCoverageUseCase } from "../../application/services/get-obligation-coverage.usecase.js";
import type { SubmitCoverageReviewUseCase } from "../../application/services/submit-coverage-review.usecase.js";
import type { GetObligationCoverageDto } from "../../application/dtos/get-obligation-coverage.dto.js";
import type { SubmitCoverageReviewDto } from "../../application/dtos/submit-coverage-review.dto.js";
import { sendResult } from "../result-to-response.js";

export class CoverageReviewController {
  constructor(
    private readonly getObligationCoverage: GetObligationCoverageUseCase,
    private readonly submitCoverageReview: SubmitCoverageReviewUseCase,
  ) {}

  getObligationCoverageHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as GetObligationCoverageDto;
    const result = await this.getObligationCoverage.execute(input);
    sendResult(res, result);
  };

  submitReviewHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as SubmitCoverageReviewDto;
    const result = await this.submitCoverageReview.execute(input);
    sendResult(res, result);
  };
}
