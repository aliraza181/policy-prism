import type { Request, Response } from "express";

import type { GetHospitalProfileUseCase } from "../../application/get-hospital-profile/get-hospital-profile.usecase.ts";
import type { ListHospitalProfilesUseCase } from "../../application/list-hospital-profiles/list-hospital-profiles.usecase.ts";
import type { ListObligationsUseCase } from "../../application/list-obligations/list-obligations.usecase.ts";
import type { SubmitObligationReviewUseCase } from "../../application/submit-obligation-review/submit-obligation-review.usecase.ts";
import type { GetHospitalProfileDto } from "../../application/get-hospital-profile/get-hospital-profile.dto.ts";
import type { ListObligationsDto } from "../../application/list-obligations/list-obligations.dto.ts";
import type { SubmitObligationReviewDto } from "../../application/submit-obligation-review/submit-obligation-review.dto.ts";
import { getHospitalProfileSchema } from "../../domain/schemas/get-hospital-profile.schema.ts";
import { listObligationsSchema } from "../../domain/schemas/list-obligations.schema.ts";
import { submitObligationReviewSchema } from "../../domain/schemas/submit-obligation-review.schema.ts";
import { Result } from "../../shared/result.ts";
import { parseOrThrow } from "../parse-request.ts";
import { sendResult } from "../result-to-response.ts";

export class HospitalProfileController {
  constructor(
    private readonly getHospitalProfile: GetHospitalProfileUseCase,
    private readonly listHospitalProfiles: ListHospitalProfilesUseCase,
    private readonly listObligations: ListObligationsUseCase,
    private readonly submitObligationReview: SubmitObligationReviewUseCase,
  ) {}

  getHospitalProfileHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: GetHospitalProfileDto = parseOrThrow(getHospitalProfileSchema, {
      hospitalProfileId: req.params.id,
    });
    const result = await this.getHospitalProfile.execute(validated);
    sendResult(res, result.success ? Result.ok(result.data.toPublic()) : result);
  };

  listHospitalProfilesHandler = async (_req: Request, res: Response): Promise<void> => {
    const profiles = await this.listHospitalProfiles.execute();
    res.status(200).json(profiles.map((profile) => profile.toPublic()));
  };

  listObligationsHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: ListObligationsDto = parseOrThrow(listObligationsSchema, {
      hospitalProfileId: req.params.id,
      decision: req.query.decision,
      page: req.query.page,
      pageSize: req.query.pageSize,
    });
    const result = await this.listObligations.execute(validated);
    res.status(200).json({
      items: result.items.map((obligation) => obligation.toPublic()),
      total: result.total,
    });
  };

  submitObligationReviewHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: SubmitObligationReviewDto = parseOrThrow(submitObligationReviewSchema, {
      obligationId: req.params.obligationId,
      ...(req.body as Record<string, unknown>),
    });
    const result = await this.submitObligationReview.execute(validated);
    sendResult(res, result.success ? Result.ok(result.data.toPublic()) : result);
  };
}
