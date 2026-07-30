import neo4j, { type Driver, type Record as Neo4jRecord, type RecordShape } from "neo4j-driver";

import { Result } from "../../domain/shared/result.js";
import type {
  CoverageReviewRepository,
  SubmitCoverageReviewInput,
} from "../../domain/coverage-review/coverage-review.repository.js";
import type { ObligationCoverageMapping } from "../../domain/coverage-review/obligation-coverage-mapping.js";
import type { ObligationContext } from "../../domain/coverage-review/obligation-context.js";
import type { ObligationCoverageResult } from "../../domain/coverage-review/obligation-coverage-result.js";
import type { CoverageEdge } from "../../domain/policy/coverage-edge.js";
import { CoverageEdgeNotFoundError } from "../../domain/coverage-review/coverage-review.errors.js";
import { NormativeStatementNotFoundError } from "../../domain/normative-statement/normative-statement.errors.js";
import { toCoverageEdge } from "./neo4j-policy.repository.js";
import { withSession } from "./session.js";

function toObligationCoverageMapping(record: Neo4jRecord<RecordShape>): ObligationCoverageMapping {
  return {
    ...toCoverageEdge(record),
    policyId: record.get("policyId") as string,
    policyTitle: record.get("policyTitle") as string,
    sectionText: record.get("sectionText") as string,
  };
}

function toObligationContext(record: Neo4jRecord<RecordShape>): ObligationContext {
  const statementCount = record.get("statementCount") as unknown;
  return {
    normativeStatementId: record.get("normativeStatementId") as string,
    normativeStatementText: record.get("normativeStatementText") as string,
    modality: record.get("modality") as string,
    actorLabel: record.get("actorLabel") as string,
    action: record.get("action") as string,
    object: record.get("object") as string,
    provisionId: record.get("provisionId") as string,
    citationLabel: record.get("citationLabel") as string,
    instrumentRef: record.get("instrumentRef") as string,
    provisionText: record.get("provisionText") as string,
    statementCount: neo4j.isInt(statementCount) ? statementCount.toNumber() : (statementCount as number),
  };
}

const COVERAGE_EDGE_RETURN = `
  c.id AS id, s.id AS sectionId, s.section_ref AS sectionRef,
  ns.id AS normativeStatementId, ns.statement_text AS normativeStatementText,
  c.edge_type AS edgeType, c.explanation AS explanation,
  c.policy_text_match AS policyTextMatch, c.evidence_match AS evidenceMatch,
  c.confidence AS confidence, c.match_type AS matchType,
  c.human_reviewer_signoff AS humanReviewerSignoff, c.requires_review AS requiresReview,
  coalesce(c.review_status, "pending") AS reviewStatus,
  c.reason_category AS reasonCategory, c.review_note AS reviewNote,
  c.reviewed_by AS reviewedBy, c.reviewed_at AS reviewedAt
`;

export class Neo4jCoverageReviewRepository implements CoverageReviewRepository {
  constructor(private readonly driver: Driver) {}

  async findByNormativeStatementId(
    normativeStatementId: string,
  ): Promise<Result<ObligationCoverageResult, NormativeStatementNotFoundError>> {
    return withSession(this.driver, async (session) => {
      const contextResult = await session.run(
        `MATCH (ns:NormativeStatement {id: $normativeStatementId})-[:EXTRACTED_FROM]->(prov:Provision)
         OPTIONAL MATCH (sibling:NormativeStatement)-[:EXTRACTED_FROM]->(prov)
         RETURN ns.id AS normativeStatementId, ns.statement_text AS normativeStatementText,
                ns.modality AS modality, ns.actor_label AS actorLabel,
                ns.action AS action, ns.object AS object,
                prov.id AS provisionId, prov.citation_label AS citationLabel,
                prov.instrument_ref AS instrumentRef, prov.clean_text AS provisionText,
                count(sibling) AS statementCount`,
        { normativeStatementId },
      );
      const contextRecord = contextResult.records[0];
      if (!contextRecord) {
        return Result.err(new NormativeStatementNotFoundError(normativeStatementId));
      }

      const mappingsResult = await session.run(
        `MATCH (p:Policy)-[:HAS_SECTION]->(s:PolicySection)-[c:COVERAGE]->(ns:NormativeStatement {id: $normativeStatementId})
         RETURN ${COVERAGE_EDGE_RETURN}, p.id AS policyId, p.title AS policyTitle, s.clean_text AS sectionText
         ORDER BY c.confidence DESC`,
        { normativeStatementId },
      );

      return Result.ok({
        context: toObligationContext(contextRecord),
        mappings: mappingsResult.records.map(toObligationCoverageMapping),
      });
    });
  }

  async submitReview(
    input: SubmitCoverageReviewInput,
  ): Promise<Result<CoverageEdge, CoverageEdgeNotFoundError>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (s:PolicySection)-[c:COVERAGE {id: $edgeId}]->(ns:NormativeStatement)
         SET c.review_status = $reviewStatus,
             c.reason_category = $reasonCategory,
             c.review_note = $note,
             c.reviewed_by = $reviewerName,
             c.reviewed_at = $reviewedAt,
             c.human_reviewer_signoff = $humanReviewerSignoff,
             c.edge_type = coalesce($edgeType, c.edge_type)
         RETURN ${COVERAGE_EDGE_RETURN}`,
        {
          edgeId: input.edgeId,
          reviewStatus: input.verdict,
          reasonCategory: input.reasonCategory ?? null,
          note: input.note ?? null,
          reviewerName: input.reviewerName,
          reviewedAt: new Date().toISOString(),
          humanReviewerSignoff: input.humanReviewerSignoff,
          edgeType: input.edgeType,
        },
      );
      const record = result.records[0];
      if (!record) {
        return Result.err(new CoverageEdgeNotFoundError(input.edgeId));
      }
      return Result.ok(toCoverageEdge(record));
    });
  }
}
