import { Result } from "../../domain/shared/result.js";
import { validate } from "../shared/validate.js";
import type { ValidationError } from "../shared/errors.js";
import type { HospitalProfileRepository } from "../../domain/hospital-profile/hospital-profile.repository.js";
import type { HospitalProfile } from "../../domain/hospital-profile/hospital-profile.entity.js";
import type { HospitalProfileNotFoundError } from "../../domain/hospital-profile/hospital-profile.errors.js";
import { getHospitalProfileSchema } from "./dto/get-hospital-profile.dto.js";

export class GetHospitalProfileUseCase {
  constructor(private readonly hospitalProfiles: HospitalProfileRepository) {}

  async execute(
    input: unknown,
  ): Promise<Result<HospitalProfile, ValidationError | HospitalProfileNotFoundError>> {
    const validated = validate(getHospitalProfileSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }
    return this.hospitalProfiles.findById(validated.value.id);
  }
}
