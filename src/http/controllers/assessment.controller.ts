import type { Request, Response } from "express";

import type { SubmitAssessmentRunUseCase } from "../../application/services/submit-assessment-run.usecase.js";
import type { GetRunUseCase } from "../../application/services/get-run.usecase.js";
import type { ListGapsUseCase } from "../../application/services/list-gaps.usecase.js";
import type { SubmitAssessmentRunDto } from "../../domain/types/submit-assessment-run.js";
import type { GetRunDto } from "../../domain/types/get-run.js";
import type { ListGapsDto } from "../../domain/types/list-gaps.js";
import { sendResult } from "../result-to-response.js";

export class AssessmentController {
  constructor(
    private readonly submitAssessmentRun: SubmitAssessmentRunUseCase,
    private readonly getRun: GetRunUseCase,
    private readonly listGaps: ListGapsUseCase,
  ) {}

  submitRunHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as SubmitAssessmentRunDto;
    const input: SubmitAssessmentRunDto = {
      hospitalProfileId: validated.hospitalProfileId,
      instrument: validated.instrument,
      department: validated.department,
      purpose: validated.purpose,
    };
    const result = await this.submitAssessmentRun.execute(input);
    sendResult(res, result);
  };

  getRunHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as GetRunDto;
    const input: GetRunDto = { runId: validated.runId };
    const result = await this.getRun.execute(input);
    sendResult(res, result);
  };

  listGapsHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as ListGapsDto;
    const input: ListGapsDto = {
      runId: validated.runId,
      gapType: validated.gapType,
      tier1CriticalOnly: validated.tier1CriticalOnly,
    };
    const result = await this.listGaps.execute(input);
    sendResult(res, result);
  };
}
