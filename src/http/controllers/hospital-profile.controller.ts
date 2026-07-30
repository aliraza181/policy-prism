import type { Request, Response } from "express";

import type { GetHospitalProfileUseCase } from "../../application/services/get-hospital-profile.usecase.js";
import type { GetHospitalProfileDto } from "../../domain/types/get-hospital-profile.js";
import { Result } from "../../shared/result.js";
import { sendResult } from "../result-to-response.js";

export class HospitalProfileController {
  constructor(private readonly getHospitalProfile: GetHospitalProfileUseCase) {}

  getHospitalProfileHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as GetHospitalProfileDto;
    const input: GetHospitalProfileDto = { id: validated.id };
    const result = await this.getHospitalProfile.execute(input);
    sendResult(res, result.success ? Result.ok(result.data.toPublic()) : result);
  };
}
