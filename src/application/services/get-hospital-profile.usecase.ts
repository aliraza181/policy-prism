import type { Result } from "../../shared/result.js";
import type { HospitalProfileRepository } from "../../domain/repositories/hospital-profile.repository.js";
import type { HospitalProfile } from "../../domain/entities/hospital-profile.entity.js";
import type { HospitalProfileNotFoundError } from "../../domain/errors/hospital-profile.errors.js";
import type { GetHospitalProfileDto } from "../../domain/types/get-hospital-profile.js";

export class GetHospitalProfileUseCase {
  constructor(private readonly hospitalProfiles: HospitalProfileRepository) {}

  async execute(input: GetHospitalProfileDto): Promise<Result<HospitalProfile, HospitalProfileNotFoundError>> {
    return this.hospitalProfiles.findById(input.id);
  }
}
