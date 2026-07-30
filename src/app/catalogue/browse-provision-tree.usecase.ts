import { Result } from "../../domain/shared/result.js";
import type { ValidationError } from "../shared/errors.js";
import type { ProvisionRepository } from "../../domain/provision/provision.repository.js";
import type { Provision } from "../../domain/provision/provision.entity.js";
import { browseProvisionTreeSchema } from "./dto/browse-provision-tree.dto.js";
import { validate } from "../shared/validate.js";

export class BrowseProvisionTreeUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(input: unknown): Promise<Result<Provision[], ValidationError>> {
    const validated = validate(browseProvisionTreeSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const dto = validated.value;
    const children = dto.parentProvisionId
      ? await this.provisions.findChildren(dto.parentProvisionId)
      : await this.provisions.findTopLevelSections(dto.instrumentRef);
    return Result.ok(children);
  }
}
