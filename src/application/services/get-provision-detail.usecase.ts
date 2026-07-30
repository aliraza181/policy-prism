import { Result } from "../../shared/result.js";
import type { ProvisionRepository } from "../../domain/repositories/provision.repository.js";
import type { ProvisionNotFoundError } from "../../domain/errors/provision.errors.js";
import type { NormativeStatementRepository } from "../../domain/repositories/normative-statement.repository.js";
import type { Provision } from "../../domain/entities/provision.entity.js";
import type { NormativeStatement } from "../../domain/entities/normative-statement.entity.js";
import type { ProvisionReference } from "../../domain/types/provision-reference.js";
import type { GetProvisionDetailDto } from "../../domain/types/get-provision-detail.js";

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
