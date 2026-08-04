import neo4j, { type Driver, type Record as Neo4jRecord, type RecordShape } from "neo4j-driver";

import { Result } from "../../../shared/result.ts";
import type { IPolicyRepository } from "./IPolicy.repository.ts";
import { Policy } from "../../../domain/entities/policy.entity.ts";
import { PolicyNotFoundError } from "../../../shared/errors.ts";
import type { PolicySection } from "../../../domain/types/policy-section.ts";
import type { CoverageEdge } from "../../../domain/types/coverage-edge.ts";
import { withSession } from "../../database/session.ts";

function toOrderIndex(value: unknown): number {
  return neo4j.isInt(value) ? value.toNumber() : ((value as number | null) ?? 0);
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

function toPolicy(record: Neo4jRecord<RecordShape>): Policy {
  return Policy.reconstitute({
    id: record.get("id") as string,
    title: record.get("title") as string,
    formatType: record.get("formatType") as string,
    sourceUri: record.get("sourceUri") as string,
    hospitalProfileId: (record.get("hospitalProfileId") as string | null) ?? null,
    department: (record.get("department") as string | null) ?? null,
    owner: (record.get("owner") as string | null) ?? null,
    policyNumber: (record.get("policyNumber") as string | null) ?? null,
    effectiveDate: (record.get("effectiveDate") as string | null) ?? null,
    nextReviewDate: (record.get("nextReviewDate") as string | null) ?? null,
    nativeMetadata: parseJsonProp(record.get("nativeMetadataJson"), {}),
    approvals: parseJsonProp(record.get("approvalsJson"), []),
    revisionHistory: parseJsonProp(record.get("revisionHistoryJson"), []),
    crossReferences: parseJsonProp(record.get("crossReferencesJson"), []),
  });
}

function toPolicySection(record: Neo4jRecord<RecordShape>): PolicySection {
  return {
    id: record.get("id") as string,
    policyId: record.get("policyId") as string,
    sectionRef: record.get("sectionRef") as string,
    level: record.get("level") as string,
    parentId: (record.get("parentId") as string | null) ?? null,
    rawText: record.get("rawText") as string,
    cleanText: record.get("cleanText") as string,
    orderIndex: toOrderIndex(record.get("orderIndex")),
  };
}

// Exported for reuse by neo4j-coverage-review/neo4j-coverage-review.repository.ts,
// which reads the same COVERAGE edge shape from the opposite traversal
// direction (obligation -> policies instead of policy -> obligations).
export function toCoverageEdge(record: Neo4jRecord<RecordShape>): CoverageEdge {
  return {
    id: record.get("id") as string,
    sectionId: record.get("sectionId") as string,
    sectionRef: record.get("sectionRef") as string,
    normativeStatementId: record.get("normativeStatementId") as string,
    normativeStatementText: record.get("normativeStatementText") as string,
    edgeType: record.get("edgeType") as string,
    explanation: record.get("explanation") as string,
    policyTextMatch: record.get("policyTextMatch") as string,
    evidenceMatch: record.get("evidenceMatch") as string,
    confidence: record.get("confidence") as number,
    matchType: record.get("matchType") as string,
    humanReviewerSignoff: record.get("humanReviewerSignoff") as boolean,
    requiresReview: record.get("requiresReview") as boolean,
    // Existing edges predate the review feature and have no review_status
    // property yet - COALESCE in the Cypher below defaults it to "pending".
    reviewStatus: record.get("reviewStatus") as CoverageEdge["reviewStatus"],
    reasonCategory: (record.get("reasonCategory") as CoverageEdge["reasonCategory"] | null) ?? null,
    reviewNote: (record.get("reviewNote") as string | null) ?? null,
    reviewedBy: (record.get("reviewedBy") as string | null) ?? null,
    reviewedAt: (record.get("reviewedAt") as string | null) ?? null,
  };
}

const POLICY_RETURN = `
  p.id AS id, p.title AS title, p.format_type AS formatType, p.source_uri AS sourceUri,
  p.hospital_profile_id AS hospitalProfileId,
  p.department AS department, p.owner AS owner, p.policy_number AS policyNumber,
  p.effective_date AS effectiveDate, p.next_review_date AS nextReviewDate,
  p.native_metadata_json AS nativeMetadataJson, p.approvals_json AS approvalsJson,
  p.revision_history_json AS revisionHistoryJson, p.cross_references_json AS crossReferencesJson
`;

export class Neo4jPolicyRepository implements IPolicyRepository {
  constructor(private readonly driver: Driver) {}

  async findById(id: string): Promise<Result<Policy, PolicyNotFoundError>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(`MATCH (p:Policy {id: $id}) RETURN ${POLICY_RETURN}`, { id });
      const record = result.records[0];
      if (!record) {
        return Result.err(new PolicyNotFoundError(id));
      }
      return Result.ok(toPolicy(record));
    });
  }

  async listAll(): Promise<Policy[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(`MATCH (p:Policy) RETURN ${POLICY_RETURN} ORDER BY p.title`);
      return result.records.map(toPolicy);
    });
  }

  async findSections(policyId: string): Promise<PolicySection[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (:Policy {id: $policyId})-[:HAS_SECTION]->(s:PolicySection)
         OPTIONAL MATCH (parent:PolicySection)-[:PARENT_OF]->(s)
         RETURN s.id AS id, $policyId AS policyId, s.section_ref AS sectionRef,
                s.level AS level, parent.id AS parentId, s.raw_text AS rawText,
                coalesce(s.display_text, s.clean_text) AS cleanText, s.order_index AS orderIndex
         ORDER BY s.order_index`,
        { policyId },
      );
      return result.records.map(toPolicySection);
    });
  }

  async findCoverageEdges(policyId: string): Promise<CoverageEdge[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (:Policy {id: $policyId})-[:HAS_SECTION]->(s:PolicySection)-[c:COVERAGE]->(ns:NormativeStatement)
         RETURN c.id AS id, s.id AS sectionId, s.section_ref AS sectionRef,
                ns.id AS normativeStatementId, ns.statement_text AS normativeStatementText,
                c.edge_type AS edgeType, c.explanation AS explanation,
                c.policy_text_match AS policyTextMatch, c.evidence_match AS evidenceMatch,
                c.confidence AS confidence, c.match_type AS matchType,
                c.human_reviewer_signoff AS humanReviewerSignoff, c.requires_review AS requiresReview,
                coalesce(c.review_status, "pending") AS reviewStatus,
                c.reason_category AS reasonCategory, c.review_note AS reviewNote,
                c.reviewed_by AS reviewedBy, c.reviewed_at AS reviewedAt
         ORDER BY s.order_index, c.confidence DESC`,
        { policyId },
      );
      return result.records.map(toCoverageEdge);
    });
  }
}
