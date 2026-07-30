import type { Request, Response } from "express";

import type { SubmitAssessmentRunUseCase } from "../../application/services/submit-assessment-run.usecase.js";
import type { GetRunUseCase } from "../../application/services/get-run.usecase.js";
import type { ListGapsUseCase } from "../../application/services/list-gaps.usecase.js";
import type { SubmitAssessmentRunDto } from "../../application/dtos/submit-assessment-run.dto.js";
import type { GetRunDto } from "../../application/dtos/get-run.dto.js";
import type { ListGapsDto } from "../../application/dtos/list-gaps.dto.js";
import { sendResult } from "../result-to-response.js";

export class AssessmentController {
  constructor(
    private readonly submitAssessmentRun: SubmitAssessmentRunUseCase,
    private readonly getRun: GetRunUseCase,
    private readonly listGaps: ListGapsUseCase,
  ) {}

  submitRunHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as SubmitAssessmentRunDto;
    const result = await this.submitAssessmentRun.execute(input);
    sendResult(res, result);
  };

  getRunHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as GetRunDto;
    const result = await this.getRun.execute(input);
    sendResult(res, result);
  };

  listGapsHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as ListGapsDto;
    const result = await this.listGaps.execute(input);
    sendResult(res, result);
  };
}
