import type { NormativeStatement } from "../entities/normative-statement.entity.ts";

export interface NormativeStatementRepository {
  findByProvisionId(provisionId: string): Promise<NormativeStatement[]>;
}
