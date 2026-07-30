import type { Request, Response } from "express";

import type { SubmitAssessmentRunUseCase } from "../../../app/assessment/submit-assessment-run.usecase.js";
import type { GetRunUseCase } from "../../../app/assessment/get-run.usecase.js";
import type { ListGapsUseCase } from "../../../app/assessment/list-gaps.usecase.js";
import { sendResult } from "../result-to-response.js";

export class AssessmentController {
  constructor(
    private readonly submitAssessmentRun: SubmitAssessmentRunUseCase,
    private readonly getRun: GetRunUseCase,
    private readonly listGaps: ListGapsUseCase,
  ) {}

  submitRunHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.submitAssessmentRun.execute(req.body);
    sendResult(res, result);
  };

  getRunHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.getRun.execute({ runId: req.params.runId });
    sendResult(res, result);
  };

  listGapsHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.listGaps.execute({
      runId: req.params.runId,
      gapType: req.query.gapType,
      tier1CriticalOnly: req.query.tier1CriticalOnly === "true" ? true : undefined,
    });
    sendResult(res, result);
  };
}
