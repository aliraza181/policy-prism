import type { Driver } from "neo4j-driver";

import type { INormativeStatementRepository } from "./INormativeStatement.repository.ts";
import { NormativeStatement } from "../../../domain/entities/normative-statement.entity.ts";
import { withSession } from "../../database/session.ts";

export class Neo4jNormativeStatementRepository implements INormativeStatementRepository {
  constructor(private readonly driver: Driver) {}

  async findByProvisionId(provisionId: string): Promise<NormativeStatement[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (ns:NormativeStatement)-[:EXTRACTED_FROM]->(p:Provision {id: $provisionId})
         RETURN ns.id AS id, ns.statement_text AS statementText, ns.modality AS modality,
                ns.actor_label AS actorLabel, ns.actor_kind AS actorKind, ns.action AS action,
                ns.object AS object, ns.source_excerpt AS sourceExcerpt,
                ns.source_statement_kind AS sourceStatementKind
         ORDER BY ns.id`,
        { provisionId },
      );
      return result.records.map((record) =>
        NormativeStatement.reconstitute({
          id: record.get("id") as string,
          statementText: (record.get("statementText") as string | null) ?? "",
          modality: (record.get("modality") as string | null) ?? "",
          actorLabel: (record.get("actorLabel") as string | null) ?? "",
          actorKind: (record.get("actorKind") as string | null) ?? "",
          action: (record.get("action") as string | null) ?? "",
          object: (record.get("object") as string | null) ?? "",
          sourceExcerpt: (record.get("sourceExcerpt") as string | null) ?? "",
          sourceStatementKind: (record.get("sourceStatementKind") as string | null) ?? "",
          provisionId,
        }),
      );
    });
  }
}
