import neo4j, { type Driver, type Record as Neo4jRecord, type RecordShape } from "neo4j-driver";

import { Result } from "../../../shared/result.ts";
import type { IAssessmentRepository, ListGapsQuery } from "./IAssessment.repository.ts";
import type { AssessmentRun } from "../../../domain/types/assessment-run.ts";
import type { Gap } from "../../../domain/types/gap.ts";
import { AssessmentRunNotFoundError } from "../../../shared/errors.ts";
import { withSession } from "../../database/session.ts";

function toNullableInt(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  return neo4j.isInt(value) ? value.toNumber() : (value as number);
}

function parseJsonProp<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function toAssessmentRun(record: Neo4jRecord<RecordShape>): AssessmentRun {
  return {
    id: record.get("id") as string,
    runPurpose: record.get("runPurpose") as string,
    hospitalProfileId: record.get("hospitalProfileId") as string,
    status: record.get("status") as string,
    gapCount: toNullableInt(record.get("gapCount")),
    coveredCount: toNullableInt(record.get("coveredCount")),
    runStartedAt: record.get("runStartedAt") as string,
  };
}

function toGap(record: Neo4jRecord<RecordShape>): Gap {
  return {
    id: record.get("id") as string,
    obligationId: record.get("obligationId") as string,
    obligationTitle: (record.get("obligationTitle") as string | null) ?? null,
    normativeStatementId: record.get("normativeStatementId") as string,
    normativeStatementText: record.get("normativeStatementText") as string,
    citationLabel: record.get("citationLabel") as string,
    provisionId: (record.get("provisionId") as string | null) ?? null,
    gapType: record.get("gapType") as string,
    missingComponents: parseJsonProp(record.get("missingComponentsJson"), []),
    surveyRisk: record.get("surveyRisk") as string,
    patientSafetyRisk: record.get("patientSafetyRisk") as string,
    governanceUrgency: record.get("governanceUrgency") as string,
    riskTierFloor: toNullableInt(record.get("riskTierFloor")),
    tier1Critical: (record.get("tier1Critical") as boolean | null) ?? false,
    ownerRole: record.get("ownerRole") as string,
    ownerReroutesToOnAssessment: (record.get("ownerReroutesToOnAssessment") as string | null) ?? null,
    rationale: record.get("rationale") as string,
    coveringPolicyId: (record.get("coveringPolicyId") as string | null) ?? null,
    coveringPolicyTitle: (record.get("coveringPolicyTitle") as string | null) ?? null,
    coveringSectionId: (record.get("coveringSectionId") as string | null) ?? null,
    coveringSectionRef: (record.get("coveringSectionRef") as string | null) ?? null,
  };
}

export class Neo4jAssessmentRepository implements IAssessmentRepository {
  constructor(private readonly driver: Driver) {}

  async findRunById(id: string): Promise<Result<AssessmentRun, AssessmentRunNotFoundError>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (r:AssessmentRun {id: $id})
         RETURN r.id AS id, r.run_purpose AS runPurpose, r.hospital_profile_id AS hospitalProfileId,
                r.status AS status, r.gap_count AS gapCount, r.covered_count AS coveredCount,
                r.run_started_at AS runStartedAt`,
        { id },
      );
      const record = result.records[0];
      if (!record) {
        return Result.err(new AssessmentRunNotFoundError(id));
      }
      return Result.ok(toAssessmentRun(record));
    });
  }

  async listGaps(query: ListGapsQuery): Promise<Gap[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (g:Gap)-[:FROM_ASSESSMENT_RUN]->(:AssessmentRun {id: $runId})
         MATCH (g)-[:FOR_NORMATIVE_STATEMENT]->(ns:NormativeStatement)
         OPTIONAL MATCH (ns)-[:EXTRACTED_FROM]->(p:Provision)
         WHERE ($gapType IS NULL OR g.gap_type = $gapType)
           AND ($tier1CriticalOnly = false OR g.tier1_critical = true)
         RETURN g.id AS id, g.obligation_id AS obligationId, g.obligation_title AS obligationTitle,
                ns.id AS normativeStatementId, ns.statement_text AS normativeStatementText,
                p.citation_label AS citationLabel, p.id AS provisionId, g.gap_type AS gapType,
                g.missing_components_json AS missingComponentsJson, g.survey_risk AS surveyRisk,
                g.patient_safety_risk AS patientSafetyRisk, g.governance_urgency AS governanceUrgency,
                g.risk_tier_floor AS riskTierFloor, g.tier1_critical AS tier1Critical,
                g.owner_role AS ownerRole, g.owner_reroutes_to_on_assessment AS ownerReroutesToOnAssessment,
                g.rationale AS rationale, g.covering_policy_id AS coveringPolicyId,
                g.covering_policy_title AS coveringPolicyTitle, g.covering_section_id AS coveringSectionId,
                g.covering_section_ref AS coveringSectionRef
         ORDER BY g.gap_type, g.tier1_critical DESC`,
        {
          runId: query.runId,
          gapType: query.gapType ?? null,
          tier1CriticalOnly: query.tier1CriticalOnly ?? false,
        },
      );
      return result.records.map(toGap);
    });
  }

  async listRuns(hospitalProfileId?: string): Promise<AssessmentRun[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (r:AssessmentRun)
         WHERE $hospitalProfileId IS NULL OR r.hospital_profile_id = $hospitalProfileId
         RETURN r.id AS id, r.run_purpose AS runPurpose, r.hospital_profile_id AS hospitalProfileId,
                r.status AS status, r.gap_count AS gapCount, r.covered_count AS coveredCount,
                r.run_started_at AS runStartedAt
         ORDER BY r.run_started_at DESC`,
        { hospitalProfileId: hospitalProfileId ?? null },
      );
      return result.records.map(toAssessmentRun);
    });
  }
}
