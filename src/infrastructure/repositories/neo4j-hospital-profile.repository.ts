import type { Driver, Record as Neo4jRecord, RecordShape } from "neo4j-driver";

import { Result } from "../../shared/result.js";
import type { HospitalProfileRepository } from "../../domain/repositories/hospital-profile.repository.js";
import { HospitalProfile } from "../../domain/entities/hospital-profile.entity.js";
import type { Facility, ProfileFact, ProfileFactConfidence, ProfileFactPosture, ProfileFactStatus } from "../../domain/entities/hospital-profile.entity.js";
import { HospitalProfileNotFoundError } from "../../domain/errors/hospital-profile.errors.js";
import { withSession } from "../database/session.js";

const FACT_GROUPS = [
  { prop: "participationAndLicensure", relation: "HAS_PARTICIPATION_FACT" },
  { prop: "servicesAndCapabilities", relation: "HAS_SERVICE_FACT" },
  { prop: "unitsAndCareSettings", relation: "HAS_UNIT_FACT" },
  { prop: "patientPopulationsAndServiceArea", relation: "HAS_POPULATION_FACT" },
] as const;

function toFacility(record: Neo4jRecord<RecordShape>): Facility {
  return {
    facilityId: record.get("facilityId") as string,
    facilityName: record.get("facilityName") as string,
    facilityType: record.get("facilityType") as string,
    licenseClass: record.get("licenseClass") as string,
  };
}

function toProfileFact(record: Neo4jRecord<RecordShape>): ProfileFact {
  return {
    key: record.get("key") as string,
    status: record.get("status") as ProfileFactStatus,
    facilityId: (record.get("facilityId") as string | null) ?? null,
    value: (record.get("value") as string | null) ?? null,
    posture: record.get("posture") as ProfileFactPosture,
    confidence: record.get("confidence") as ProfileFactConfidence,
    effectiveFrom: (record.get("effectiveFrom") as string | null) ?? null,
    effectiveTo: (record.get("effectiveTo") as string | null) ?? null,
    evidenceRefs: (record.get("evidenceRefs") as string[] | null) ?? [],
    notes: (record.get("notes") as string | null) ?? null,
  };
}

function factId(profileId: string, group: string, fact: ProfileFact): string {
  return `${profileId}:${group}:${fact.key}:${fact.facilityId ?? "org"}`;
}

export class Neo4jHospitalProfileRepository implements HospitalProfileRepository {
  constructor(private readonly driver: Driver) {}

  async findById(id: string): Promise<Result<HospitalProfile, HospitalProfileNotFoundError>> {
    return withSession(this.driver, async (session) => {
      const profileResult = await session.run(
        `MATCH (p:HospitalProfile {id: $id})
         RETURN p.legalEntityName AS legalEntityName, p.displayName AS displayName,
                p.jurisdiction AS jurisdiction, p.state AS state`,
        { id },
      );
      const profileRecord = profileResult.records[0];
      if (!profileRecord) {
        return Result.err(new HospitalProfileNotFoundError(id));
      }

      const facilitiesResult = await session.run(
        `MATCH (:HospitalProfile {id: $id})-[:HAS_FACILITY]->(f:Facility)
         RETURN f.facilityId AS facilityId, f.facilityName AS facilityName,
                f.facilityType AS facilityType, f.licenseClass AS licenseClass
         ORDER BY f.facilityId`,
        { id },
      );
      const facilities = facilitiesResult.records.map(toFacility);

      const factsByGroup: Record<string, ProfileFact[]> = {};
      for (const group of FACT_GROUPS) {
        const result = await session.run(
          `MATCH (:HospitalProfile {id: $id})-[:${group.relation}]->(fact:ProfileFact)
           RETURN fact.key AS key, fact.status AS status, fact.facilityId AS facilityId,
                  fact.value AS value, fact.posture AS posture, fact.confidence AS confidence,
                  fact.effectiveFrom AS effectiveFrom, fact.effectiveTo AS effectiveTo,
                  fact.evidenceRefs AS evidenceRefs, fact.notes AS notes
           ORDER BY fact.key`,
          { id },
        );
        factsByGroup[group.prop] = result.records.map(toProfileFact);
      }

      return Result.ok(
        HospitalProfile.reconstitute({
          id,
          identity: {
            legalEntityName: profileRecord.get("legalEntityName") as string,
            displayName: profileRecord.get("displayName") as string,
            jurisdiction: profileRecord.get("jurisdiction") as string,
            state: profileRecord.get("state") as string,
          },
          facilities,
          participationAndLicensure: factsByGroup.participationAndLicensure ?? [],
          servicesAndCapabilities: factsByGroup.servicesAndCapabilities ?? [],
          unitsAndCareSettings: factsByGroup.unitsAndCareSettings ?? [],
          patientPopulationsAndServiceArea: factsByGroup.patientPopulationsAndServiceArea ?? [],
          sourceScopeOverrides: [],
        }),
      );
    });
  }

  async save(profile: HospitalProfile): Promise<void> {
    return withSession(this.driver, async (session) => {
      const props = profile.toJSON();

      await session.run(
        `MERGE (p:HospitalProfile {id: $id})
         SET p.legalEntityName = $legalEntityName, p.displayName = $displayName,
             p.jurisdiction = $jurisdiction, p.state = $state
         WITH p
         UNWIND $facilities AS f
         MERGE (fac:Facility {facilityId: f.facilityId})
         SET fac.facilityName = f.facilityName, fac.facilityType = f.facilityType, fac.licenseClass = f.licenseClass
         MERGE (p)-[:HAS_FACILITY]->(fac)`,
        { id: props.id, ...props.identity, facilities: props.facilities },
      );

      for (const group of FACT_GROUPS) {
        const facts = props[group.prop].map((fact) => ({ ...fact, factId: factId(props.id, group.prop, fact) }));
        if (facts.length === 0) {
          continue;
        }
        await session.run(
          `MATCH (p:HospitalProfile {id: $id})
           UNWIND $facts AS fact
           MERGE (n:ProfileFact {factId: fact.factId})
           SET n.key = fact.key, n.status = fact.status, n.facilityId = fact.facilityId,
               n.value = fact.value, n.posture = fact.posture, n.confidence = fact.confidence,
               n.effectiveFrom = fact.effectiveFrom, n.effectiveTo = fact.effectiveTo,
               n.evidenceRefs = fact.evidenceRefs, n.notes = fact.notes
           MERGE (p)-[:${group.relation}]->(n)`,
          { id: props.id, facts },
        );
      }
    });
  }
}
