import type { Request, Response } from "express";

import type { GetObligationCoverageUseCase } from "../../application/get-obligation-coverage/get-obligation-coverage.usecase.ts";
import type { SubmitCoverageReviewUseCase } from "../../application/submit-coverage-review/submit-coverage-review.usecase.ts";
import type { GetObligationCoverageDto } from "../../application/get-obligation-coverage/get-obligation-coverage.dto.ts";
import type { SubmitCoverageReviewDto } from "../../application/submit-coverage-review/submit-coverage-review.dto.ts";
import { getObligationCoverageSchema } from "../../domain/schemas/get-obligation-coverage.schema.ts";
import { submitCoverageReviewSchema } from "../../domain/schemas/submit-coverage-review.schema.ts";
import { parseOrThrow } from "../parse-request.ts";
import { sendResult } from "../result-to-response.ts";

export class CoverageReviewController {
  constructor(
    private readonly getObligationCoverage: GetObligationCoverageUseCase,
    private readonly submitCoverageReview: SubmitCoverageReviewUseCase,
  ) {}

  getObligationCoverageHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: GetObligationCoverageDto = parseOrThrow(getObligationCoverageSchema, {
      normativeStatementId: req.params.normativeStatementId,
    });
    const result = await this.getObligationCoverage.execute(validated);
    sendResult(res, result);
  };

  submitReviewHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: SubmitCoverageReviewDto = parseOrThrow(submitCoverageReviewSchema, {
      ...(req.body as object),
      edgeId: req.params.edgeId,
    });
    const result = await this.submitCoverageReview.execute(validated);
    sendResult(res, result);
  };
}
