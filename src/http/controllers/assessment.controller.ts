import type { Request, Response } from "express";

import type { SubmitAssessmentRunUseCase } from "../../application/submit-assessment-run/submit-assessment-run.usecase.ts";
import type { GetRunUseCase } from "../../application/get-run/get-run.usecase.ts";
import type { ListAssessmentRunsUseCase } from "../../application/list-assessment-runs/list-assessment-runs.usecase.ts";
import type { ListGapsUseCase } from "../../application/list-gaps/list-gaps.usecase.ts";
import type { SubmitAssessmentRunDto } from "../../application/submit-assessment-run/submit-assessment-run.dto.ts";
import type { GetRunDto } from "../../application/get-run/get-run.dto.ts";
import type { ListGapsDto } from "../../application/list-gaps/list-gaps.dto.ts";
import { submitAssessmentRunSchema } from "../../domain/schemas/submit-assessment-run.schema.ts";
import { getRunSchema } from "../../domain/schemas/get-run.schema.ts";
import { listGapsSchema } from "../../domain/schemas/list-gaps.schema.ts";
import { parseOrThrow } from "../parse-request.ts";
import { sendResult } from "../result-to-response.ts";

export class AssessmentController {
  constructor(
    private readonly submitAssessmentRun: SubmitAssessmentRunUseCase,
    private readonly getRun: GetRunUseCase,
    private readonly listAssessmentRuns: ListAssessmentRunsUseCase,
    private readonly listGaps: ListGapsUseCase,
  ) {}

  listRunsHandler = async (req: Request, res: Response): Promise<void> => {
    const hospitalProfileId = typeof req.query.hospitalProfileId === "string" ? req.query.hospitalProfileId : undefined;
    const runs = await this.listAssessmentRuns.execute(hospitalProfileId);
    res.status(200).json(runs);
  };

  submitRunHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: SubmitAssessmentRunDto = parseOrThrow(submitAssessmentRunSchema, req.body);
    const result = await this.submitAssessmentRun.execute(validated);
    sendResult(res, result);
  };

  getRunHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: GetRunDto = parseOrThrow(getRunSchema, { runId: req.params.runId });
    const result = await this.getRun.execute(validated);
    sendResult(res, result);
  };

  listGapsHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: ListGapsDto = parseOrThrow(listGapsSchema, {
      runId: req.params.runId,
      gapType: req.query.gapType,
      tier1CriticalOnly: req.query.tier1CriticalOnly === "true" ? true : undefined,
    });
    const result = await this.listGaps.execute(validated);
    sendResult(res, result);
  };
}
