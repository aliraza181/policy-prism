import { Result } from "../../shared/result.ts";
import type { ProvisionRepository } from "../../domain/repositories/provision.repository.ts";
import type { ProvisionNotFoundError } from "../../shared/errors.ts";
import type { NormativeStatementRepository } from "../../domain/repositories/normative-statement.repository.ts";
import type { Provision } from "../../domain/entities/provision.entity.ts";
import type { NormativeStatement } from "../../domain/entities/normative-statement.entity.ts";
import type { ProvisionReference } from "../../domain/types/provision-reference.ts";
import type { GetProvisionDetailDto } from "../../domain/schemas/get-provision-detail.schema.ts";

export interface ProvisionDetail {
  provision: Provision;
  parentChain: Provision[];
  normativeStatements: NormativeStatement[];
  references: ProvisionReference[];
  referencedBy: ProvisionReference[];
}

export class GetProvisionDetailUseCase {
  constructor(
    private readonly provisions: ProvisionRepository,
    private readonly normativeStatements: NormativeStatementRepository,
  ) {}

  async execute(input: GetProvisionDetailDto): Promise<Result<ProvisionDetail, ProvisionNotFoundError>> {
    const { provisionId } = input;
    const found = await this.provisions.findById(provisionId);
    if (!found.success) {
      return Result.err(found.error);
    }

    const [parentChain, normativeStatements, references, referencedBy] = await Promise.all([
      this.provisions.findParentChain(provisionId),
      this.normativeStatements.findByProvisionId(provisionId),
      this.provisions.findReferences(provisionId),
      this.provisions.findReferencedBy(provisionId),
    ]);

    return Result.ok({ provision: found.data, parentChain, normativeStatements, references, referencedBy });
  }
}
