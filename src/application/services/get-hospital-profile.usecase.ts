import { Result } from "../../shared/result.js";
import { validate } from "../validate.js";
import type { ValidationError } from "../../shared/errors.js";
import type { HospitalProfileRepository } from "../../domain/repositories/hospital-profile.repository.js";
import type { HospitalProfile } from "../../domain/entities/hospital-profile.entity.js";
import type { HospitalProfileNotFoundError } from "../../domain/errors/hospital-profile.errors.js";
import { getHospitalProfileSchema } from "../dtos/get-hospital-profile.dto.js";

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
