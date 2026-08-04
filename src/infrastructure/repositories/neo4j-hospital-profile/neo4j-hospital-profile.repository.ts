import neo4j, { type Driver, type Record as Neo4jRecord, type RecordShape } from "neo4j-driver";

import { Result } from "../../../shared/result.ts";
import type { IHospitalProfileRepository } from "./IHospitalProfile.repository.ts";
import { HospitalProfile } from "../../../domain/entities/hospital-profile.entity.ts";
import { HospitalProfileNotFoundError } from "../../../shared/errors.ts";
import { withSession } from "../../database/session.ts";

function toBedCount(value: unknown): number {
  return neo4j.isInt(value) ? value.toNumber() : ((value as number | null) ?? 0);
}

function toHospitalProfile(record: Neo4jRecord<RecordShape>): HospitalProfile {
  return HospitalProfile.reconstitute({
    id: record.get("id") as string,
    name: record.get("name") as string,
    bedCount: toBedCount(record.get("bedCount")),
    sizeTier: record.get("sizeTier") as string,
    departments: (record.get("departments") as string[] | null) ?? [],
  });
}

const HOSPITAL_PROFILE_FIELDS = `
  h.id AS id, h.name AS name, h.bed_count AS bedCount, h.size_tier AS sizeTier,
  h.departments AS departments
`;

export class Neo4jHospitalProfileRepository implements IHospitalProfileRepository {
  constructor(private readonly driver: Driver) {}

  async findById(id: string): Promise<Result<HospitalProfile, HospitalProfileNotFoundError>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (h:HospitalProfile {id: $id}) RETURN ${HOSPITAL_PROFILE_FIELDS}`,
        { id },
      );
      const record = result.records[0];
      if (!record) {
        return Result.err(new HospitalProfileNotFoundError(id));
      }
      return Result.ok(toHospitalProfile(record));
    });
  }

  async listAll(): Promise<HospitalProfile[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (h:HospitalProfile) WHERE h.name IS NOT NULL RETURN ${HOSPITAL_PROFILE_FIELDS} ORDER BY h.name`,
      );
      return result.records.map(toHospitalProfile);
    });
  }
}
