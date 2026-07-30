import type { Result } from "../../shared/result.js";
import type { HospitalProfile } from "../entities/hospital-profile.entity.js";
import type { HospitalProfileNotFoundError } from "../errors/hospital-profile.errors.js";

export interface HospitalProfileRepository {
  findById(id: string): Promise<Result<HospitalProfile, HospitalProfileNotFoundError>>;
  save(profile: HospitalProfile): Promise<void>;
}
