import type { Result } from "../../../shared/result.ts";
import type { HospitalProfile } from "../../../domain/entities/hospital-profile.entity.ts";
import type { HospitalProfileNotFoundError } from "../../../shared/errors.ts";

export interface IHospitalProfileRepository {
  findById(id: string): Promise<Result<HospitalProfile, HospitalProfileNotFoundError>>;
  listAll(): Promise<HospitalProfile[]>;
}
