import { Result } from "../../shared/result.ts";
import type { ProvisionRepository } from "../../domain/repositories/provision.repository.ts";
import type { Provision } from "../../domain/entities/provision.entity.ts";
import type { BrowseProvisionTreeDto } from "../../domain/schemas/browse-provision-tree.schema.ts";

export class BrowseProvisionTreeUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(input: BrowseProvisionTreeDto): Promise<Result<Provision[], never>> {
    const children = input.parentProvisionId
      ? await this.provisions.findChildren(input.parentProvisionId)
      : await this.provisions.findTopLevelSections(input.instrumentRef);
    return Result.ok(children);
  }
}
