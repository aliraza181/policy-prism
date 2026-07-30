import type { Request, Response } from "express";

import type { GetHospitalProfileUseCase } from "../../../app/hospital-profile/get-hospital-profile.usecase.js";
import { sendResult } from "../result-to-response.js";

export class HospitalProfileController {
  constructor(private readonly getHospitalProfile: GetHospitalProfileUseCase) {}

  getHospitalProfileHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.getHospitalProfile.execute({ id: req.params.id });
    sendResult(res, result);
  };
}
