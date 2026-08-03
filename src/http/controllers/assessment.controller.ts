import type { Request, Response } from "express";

import type { SubmitAssessmentRunUseCase } from "../../application/services/submit-assessment-run.usecase.ts";
import type { GetRunUseCase } from "../../application/services/get-run.usecase.ts";
import type { ListGapsUseCase } from "../../application/services/list-gaps.usecase.ts";
import type { SubmitAssessmentRunDto } from "../../domain/schemas/submit-assessment-run.schema.ts";
import type { GetRunDto } from "../../domain/schemas/get-run.schema.ts";
import type { ListGapsDto } from "../../domain/schemas/list-gaps.schema.ts";
import { sendResult } from "../result-to-response.ts";

export class AssessmentController {
  constructor(
    private readonly submitAssessmentRun: SubmitAssessmentRunUseCase,
    private readonly getRun: GetRunUseCase,
    private readonly listGaps: ListGapsUseCase,
  ) {}

  submitRunHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as SubmitAssessmentRunDto;
    const input: SubmitAssessmentRunDto = {
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
