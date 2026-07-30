import type { NormativeStatement } from "./normative-statement.entity.js";

export interface NormativeStatementRepository {
  findByProvisionId(provisionId: string): Promise<NormativeStatement[]>;
}
