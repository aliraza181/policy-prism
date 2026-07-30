import type { NormativeStatement } from "../entities/normative-statement.entity.js";

export interface NormativeStatementRepository {
  findByProvisionId(provisionId: string): Promise<NormativeStatement[]>;
}
