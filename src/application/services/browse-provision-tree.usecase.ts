import { Result } from "../../shared/result.js";
import type { ProvisionRepository } from "../../domain/repositories/provision.repository.js";
import type { Provision } from "../../domain/entities/provision.entity.js";
import type { BrowseProvisionTreeDto } from "../../domain/types/browse-provision-tree.js";

export class BrowseProvisionTreeUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(input: BrowseProvisionTreeDto): Promise<Result<Provision[], never>> {
    const children = input.parentProvisionId
      ? await this.provisions.findChildren(input.parentProvisionId)
      : await this.provisions.findTopLevelSections(input.instrumentRef);
    return Result.ok(children);
  }
}
