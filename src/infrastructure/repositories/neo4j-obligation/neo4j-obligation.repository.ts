import neo4j, { type Driver, type Record as Neo4jRecord, type RecordShape } from "neo4j-driver";

import { Result } from "../../../shared/result.ts";
import type {
  IObligationRepository,
  ObligationListQuery,
  ObligationListResult,
  SubmitObligationReview,
} from "./IObligation.repository.ts";
import { Obligation } from "../../../domain/entities/obligation.entity.ts";
import { ObligationNotFoundError } from "../../../shared/errors.ts";
import { withSession } from "../../database/session.ts";

function toTotal(value: unknown): number {
  return neo4j.isInt(value) ? value.toNumber() : ((value as number | null) ?? 0);
}

function toObligation(record: Neo4jRecord<RecordShape>): Obligation {
  return Obligation.reconstitute({
    id: record.get("id") as string,
    hospitalProfileId: record.get("hospitalProfileId") as string,
    title: record.get("title") as string,
    decision: record.get("decision") as string,
    aiDecision: record.get("aiDecision") as string,
    reasoning: record.get("reasoning") as string,
    sourceNormativeStatementId: record.get("sourceNormativeStatementId") as string,
    sourceProvisionId: record.get("sourceProvisionId") as string,
    status: record.get("status") as string,
    reviewStatus: (record.get("reviewStatus") as string | null) ?? "pending",
    reviewNote: (record.get("reviewNote") as string | null) ?? null,
    reviewedBy: (record.get("reviewedBy") as string | null) ?? null,
    reviewedAt: (record.get("reviewedAt") as string | null) ?? null,
  });
}

const OBLIGATION_FIELDS = `
  o.id AS id, o.hospital_profile_id AS hospitalProfileId, o.title AS title,
  o.decision AS decision, o.ai_decision AS aiDecision, o.reasoning AS reasoning,
  o.source_normative_statement_id AS sourceNormativeStatementId,
  o.source_provision_id AS sourceProvisionId, o.status AS status,
  o.review_status AS reviewStatus, o.review_note AS reviewNote,
  o.reviewed_by AS reviewedBy, o.reviewed_at AS reviewedAt
`;

export class Neo4jObligationRepository implements IObligationRepository {
  constructor(private readonly driver: Driver) {}

  async listByHospitalProfile(query: ObligationListQuery): Promise<ObligationListResult> {
    return withSession(this.driver, async (session) => {
      const params = {
        hospitalProfileId: query.hospitalProfileId,
        decision: query.decision ?? null,
      };

      const countResult = await session.run(
        `MATCH (o:Obligation {hospital_profile_id: $hospitalProfileId})
         WHERE ($decision IS NULL OR o.decision = $decision)
         RETURN count(o) AS total`,
        params,
      );
      const total = toTotal(countResult.records[0]?.get("total"));

      const result = await session.run(
        `MATCH (o:Obligation {hospital_profile_id: $hospitalProfileId})
         WHERE ($decision IS NULL OR o.decision = $decision)
         RETURN ${OBLIGATION_FIELDS}
         ORDER BY o.decision, o.title
         SKIP $skip LIMIT $limit`,
        {
          ...params,
          skip: neo4j.int((query.page - 1) * query.pageSize),
          limit: neo4j.int(query.pageSize),
        },
      );
      return { items: result.records.map(toObligation), total };
    });
  }

  async submitReview(input: SubmitObligationReview): Promise<Result<Obligation, ObligationNotFoundError>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (o:Obligation {id: $obligationId})
         SET o.decision = CASE WHEN $verdict = 'overridden' THEN $overrideDecision ELSE o.decision END,
             o.review_status = $verdict,
             o.review_note = $note,
             o.reviewed_by = $reviewerName,
             o.reviewed_at = toString(datetime())
         RETURN ${OBLIGATION_FIELDS}`,
        {
          obligationId: input.obligationId,
          verdict: input.verdict,
          overrideDecision: input.overrideDecision ?? null,
          note: input.note ?? null,
          reviewerName: input.reviewerName,
        },
      );
      const record = result.records[0];
      if (!record) {
        return Result.err(new ObligationNotFoundError(input.obligationId));
      }
      return Result.ok(toObligation(record));
    });
  }
}
