import { Result } from "../../shared/result.ts";
import type { HospitalProfileNotFoundError } from "../../shared/errors.ts";
import type { HospitalProfile } from "../../domain/entities/hospital-profile.entity.ts";
import type { IHospitalProfileRepository } from "../../infrastructure/repositories/neo4j-hospital-profile/IHospitalProfile.repository.ts";
import type { GetHospitalProfileDto } from "./get-hospital-profile.dto.ts";

export class GetHospitalProfileUseCase {
  constructor(private readonly hospitalProfiles: IHospitalProfileRepository) {}

  async execute(input: GetHospitalProfileDto): Promise<Result<HospitalProfile, HospitalProfileNotFoundError>> {
    return this.hospitalProfiles.findById(input.hospitalProfileId);
  }
}
