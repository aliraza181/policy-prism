import { Result } from "../../domain/shared/result.js";
import type { ValidationError } from "../shared/errors.js";
import type { ProvisionRepository } from "../../domain/provision/provision.repository.js";
import type { ProvisionNotFoundError } from "../../domain/provision/provision.errors.js";
import type { NormativeStatementRepository } from "../../domain/normative-statement/normative-statement.repository.js";
import type { Provision } from "../../domain/provision/provision.entity.js";
import type { NormativeStatement } from "../../domain/normative-statement/normative-statement.entity.js";
import type { ProvisionReference } from "../../domain/provision/provision-reference.js";
import { getProvisionDetailSchema } from "./dto/get-provision-detail.dto.js";
import { validate } from "../shared/validate.js";

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

  async execute(
    input: unknown,
  ): Promise<Result<ProvisionDetail, ValidationError | ProvisionNotFoundError>> {
    const validated = validate(getProvisionDetailSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const { provisionId } = validated.value;
    const found = await this.provisions.findById(provisionId);
    if (found.isErr) {
      return Result.err(found.error);
    }

    const [parentChain, normativeStatements, references, referencedBy] = await Promise.all([
      this.provisions.findParentChain(provisionId),
      this.normativeStatements.findByProvisionId(provisionId),
      this.provisions.findReferences(provisionId),
      this.provisions.findReferencedBy(provisionId),
    ]);

    return Result.ok({ provision: found.value, parentChain, normativeStatements, references, referencedBy });
  }
}
