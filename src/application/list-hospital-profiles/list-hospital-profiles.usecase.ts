import type { HospitalProfile } from "../../domain/entities/hospital-profile.entity.ts";
import type { IHospitalProfileRepository } from "../../infrastructure/repositories/neo4j-hospital-profile/IHospitalProfile.repository.ts";

export class ListHospitalProfilesUseCase {
  constructor(private readonly hospitalProfiles: IHospitalProfileRepository) {}

  async execute(): Promise<HospitalProfile[]> {
    return this.hospitalProfiles.listAll();
  }
}
