import type { Driver } from "neo4j-driver";

import { Result } from "../../../shared/result.ts";
import { NotFoundError } from "../../../shared/errors.ts";
import type { IRegulatoryInstrumentRepository } from "./IRegulatoryInstrument.repository.ts";
import { RegulatoryInstrument } from "../../../domain/entities/regulatory-instrument.entity.ts";
import { withSession } from "../../database/session.ts";

export class Neo4jRegulatoryInstrumentRepository implements IRegulatoryInstrumentRepository {
  constructor(private readonly driver: Driver) {}

  async findAll(): Promise<RegulatoryInstrument[]> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (i:RegulatoryInstrument)
         RETURN i.id AS id, i.kind AS kind, i.jurisdiction AS jurisdiction
         ORDER BY i.id`,
      );
      return result.records.map((record) =>
        RegulatoryInstrument.reconstitute({
          id: record.get("id") as string,
          kind: (record.get("kind") as string | null) ?? "",
          jurisdiction: (record.get("jurisdiction") as string | null) ?? "",
        }),
      );
    });
  }

  async findById(id: string): Promise<Result<RegulatoryInstrument, NotFoundError>> {
    return withSession(this.driver, async (session) => {
      const result = await session.run(
        `MATCH (i:RegulatoryInstrument {id: $id})
         RETURN i.id AS id, i.kind AS kind, i.jurisdiction AS jurisdiction`,
        { id },
      );
      const record = result.records[0];
      if (!record) {
        return Result.err(new NotFoundError("RegulatoryInstrument", id));
      }
      return Result.ok(
        RegulatoryInstrument.reconstitute({
          id: record.get("id") as string,
          kind: (record.get("kind") as string | null) ?? "",
          jurisdiction: (record.get("jurisdiction") as string | null) ?? "",
        }),
      );
    });
  }
}
