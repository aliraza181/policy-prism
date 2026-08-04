import type { NormativeStatement } from "../../../domain/entities/normative-statement.entity.ts";

export interface INormativeStatementRepository {
  findByProvisionId(provisionId: string): Promise<NormativeStatement[]>;
}
