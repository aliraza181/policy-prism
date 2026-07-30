import type { Request, Response } from "express";

import type { GetHospitalProfileUseCase } from "../../application/services/get-hospital-profile.usecase.js";
import type { GetHospitalProfileDto } from "../../application/dtos/get-hospital-profile.dto.js";
import { sendResult } from "../result-to-response.js";

export class HospitalProfileController {
  constructor(private readonly getHospitalProfile: GetHospitalProfileUseCase) {}

  getHospitalProfileHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as GetHospitalProfileDto;
    const result = await this.getHospitalProfile.execute(input);
    sendResult(res, result);
  };
}
