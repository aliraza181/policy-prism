import neo4j, { type Driver, type Record as Neo4jRecord, type RecordShape } from "neo4j-driver";

import { Result } from "../../domain/shared/result.js";
import type {
  CatalogueSearchQuery,
  ProvisionListQuery,
  ProvisionListResult,
  ProvisionRepository,
} from "../../domain/provision/provision.repository.js";
import { Provision } from "../../domain/provision/provision.entity.js";
import { ProvisionNotFoundError } from "../../domain/provision/provision.errors.js";
import type { ProvisionReference } from "../../domain/provision/provision-reference.js";
import { withSession } from "./session.js";

function toOrderIndex(value: unknown): number {
  return neo4j.isInt(value) ? value.toNumber() : ((value as number | null) ?? 0);
}

function toProvision(record: Neo4jRecord<RecordShape>): Provision {
  return Provision.reconstitute({
    id: record.get("id") as string,
    instrumentRef: (record.get("instrumentRef") as string | null) ?? "",
    parentProvisionId: (record.get("parentProvisionId") as string | null) ?? null,
    citationLabel: record.get("citationLabel") as string,
    level: (record.get("level") as string | null) ?? "",
    rawText: (record.get("rawText") as string | null) ?? "",
    cleanText: (record.get("cleanText") as string | null) ?? "",
    orderIndex: toOrderIndex(record.get("orderIndex")),
  });
}

function toProvisionReference(record: Neo4jRecord<RecordShape>): ProvisionReference {
  return {
    id: record.get("id") as string,
    normativeStatementId: record.get("normativeStatementId") as string,
    normativeStatementText: record.get("normativeStatementText") as string,
    relation: record.get("relation") as string,
    evidence: record.get("evidence") as string,
    confidence: record.get("confidence") as number,
    rawRef: record.get("rawRef") as string,
    provisionId: record.get("provisionId") as string,
    citationLabel: record.get("citationLabel") as string,
  };
}

const PROVISION_FIELDS = `
  p.id AS id, p.instrument_ref AS instrumentRef, p.citation_label AS citationLabel,
  p.level AS level, p.raw_text AS rawText, p.clean_text AS cleanText, p.order_index AS orderIndex
`;

const ORDER_CLAUSES: Record<ProvisionListQuery["sortBy"], string> = {
  document: "p.instrument_ref, p.order_index",
  citation: "p.citation_label",
  level: "p.level, p.order_index",
};

export class Neo4jProvisionRepository implements ProvisionRepository {
  constructor(private readonly driver: Driver) {}

  async findById(id: string): Promise<Result<Provision, ProvisionNotFoundError>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (p:Provision {id: $id})
         OPTIONAL MATCH (parent:Provision)-[:PARENT_OF]->(p)
         RETURN ${PROVISION_FIELDS}, parent.id AS parentProvisionId`,
        { id },
      );
      const record = result.records[0];
      if (!record) {
        return Result.err(new ProvisionNotFoundError(id));
      }
      return Result.ok(toProvision(record));
    });
  }

  async findTopLevelSections(instrumentRef: string): Promise<Provision[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (p:Provision {level: 'section', instrument_ref: $instrumentRef})
         RETURN ${PROVISION_FIELDS}, null AS parentProvisionId
         ORDER BY p.order_index`,
        { instrumentRef },
      );
      return result.records.map(toProvision);
    });
  }

  async findChildren(parentProvisionId: string): Promise<Provision[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (parent:Provision {id: $parentProvisionId})-[:PARENT_OF]->(p:Provision)
         RETURN ${PROVISION_FIELDS}, parent.id AS parentProvisionId
         ORDER BY p.order_index`,
        { parentProvisionId },
      );
      return result.records.map(toProvision);
    });
  }

  async findParentChain(provisionId: string): Promise<Provision[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (start:Provision {id: $provisionId})
         MATCH path = (ancestor:Provision)-[:PARENT_OF*1..]->(start)
         WITH ancestor, length(path) AS distance
         OPTIONAL MATCH (grandparent:Provision)-[:PARENT_OF]->(ancestor)
         RETURN ancestor.id AS id, ancestor.instrument_ref AS instrumentRef,
                ancestor.citation_label AS citationLabel, ancestor.level AS level,
                ancestor.raw_text AS rawText, ancestor.clean_text AS cleanText,
                ancestor.order_index AS orderIndex, grandparent.id AS parentProvisionId
         ORDER BY distance DESC`,
        { provisionId },
      );
      return result.records.map(toProvision);
    });
  }

  async findReferences(provisionId: string): Promise<ProvisionReference[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (p:Provision {id: $provisionId})<-[:EXTRACTED_FROM]-(ns:NormativeStatement)
         MATCH (ns)-[r:NS_REFERENCE]->(target:Provision)
         RETURN r.id AS id, ns.id AS normativeStatementId, ns.statement_text AS normativeStatementText,
                r.relation AS relation, r.evidence AS evidence, r.confidence AS confidence,
                r.raw_ref AS rawRef, target.id AS provisionId, target.citation_label AS citationLabel
         ORDER BY r.confidence DESC`,
        { provisionId },
      );
      return result.records.map(toProvisionReference);
    });
  }

  async findReferencedBy(provisionId: string): Promise<ProvisionReference[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (target:Provision {id: $provisionId})<-[r:NS_REFERENCE]-(ns:NormativeStatement)
         MATCH (ns)-[:EXTRACTED_FROM]->(source:Provision)
         RETURN r.id AS id, ns.id AS normativeStatementId, ns.statement_text AS normativeStatementText,
                r.relation AS relation, r.evidence AS evidence, r.confidence AS confidence,
                r.raw_ref AS rawRef, source.id AS provisionId, source.citation_label AS citationLabel
         ORDER BY r.confidence DESC`,
        { provisionId },
      );
      return result.records.map(toProvisionReference);
    });
  }

  async search(query: CatalogueSearchQuery): Promise<Provision[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (p:Provision)
         WHERE ($instrumentRef IS NULL OR p.instrument_ref = $instrumentRef)
           AND (toLower(p.clean_text) CONTAINS toLower($keyword)
                OR toLower(p.citation_label) CONTAINS toLower($keyword))
         RETURN ${PROVISION_FIELDS}, null AS parentProvisionId
         ORDER BY p.order_index
         LIMIT 50`,
        { keyword: query.keyword, instrumentRef: query.instrumentRef ?? null },
      );
      return result.records.map(toProvision);
    });
  }

  async listAll(query: ProvisionListQuery): Promise<ProvisionListResult> {
    const orderClause = ORDER_CLAUSES[query.sortBy];
    return withSession(this.driver, async (session) => {
      const params = {
        instrumentRef: query.instrumentRef && query.instrumentRef.length > 0 ? query.instrumentRef : null,
        level: query.level ?? null,
        department: query.department && query.department.length > 0 ? query.department : null,
      };
      const countResult = await session.run(
        `MATCH (p:Provision)
         WHERE ($instrumentRef IS NULL OR p.instrument_ref IN $instrumentRef)
           AND ($level IS NULL OR p.level = $level)
           AND ($department IS NULL OR ANY(d IN $department WHERE d IN p.departments))
         RETURN count(p) AS total`,
        params,
      );
      const total = toOrderIndex(countResult.records[0]?.get("total"));

      const result = await session.run(
        `MATCH (p:Provision)
         WHERE ($instrumentRef IS NULL OR p.instrument_ref IN $instrumentRef)
           AND ($level IS NULL OR p.level = $level)
           AND ($department IS NULL OR ANY(d IN $department WHERE d IN p.departments))
         OPTIONAL MATCH (parent:Provision)-[:PARENT_OF]->(p)
         RETURN ${PROVISION_FIELDS}, parent.id AS parentProvisionId
         ORDER BY ${orderClause}
         SKIP $skip LIMIT $limit`,
        { ...params, skip: neo4j.int((query.page - 1) * query.pageSize), limit: neo4j.int(query.pageSize) },
      );
      return { items: result.records.map(toProvision), total };
    });
  }

  async countByInstrument(): Promise<Array<{ instrumentRef: string; count: number }>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (p:Provision)
         RETURN p.instrument_ref AS instrumentRef, count(p) AS count
         ORDER BY instrumentRef`,
      );
      return result.records.map((record) => ({
        instrumentRef: record.get("instrumentRef") as string,
        count: (record.get("count") as { toNumber(): number }).toNumber(),
      }));
    });
  }

  async countByLevel(): Promise<Array<{ level: string; count: number }>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (p:Provision)
         RETURN p.level AS level, count(p) AS count
         ORDER BY level`,
      );
      return result.records.map((record) => ({
        level: record.get("level") as string,
        count: (record.get("count") as { toNumber(): number }).toNumber(),
      }));
    });
  }

  async countByDepartment(): Promise<Array<{ department: string; count: number }>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (p:Provision)
         UNWIND p.departments AS department
         RETURN department, count(p) AS count
         ORDER BY count DESC, department ASC`,
      );
      return result.records.map((record) => ({
        department: record.get("department") as string,
        count: (record.get("count") as { toNumber(): number }).toNumber(),
      }));
    });
  }
}
