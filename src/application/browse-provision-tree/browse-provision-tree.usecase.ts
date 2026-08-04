import { Result } from "../../shared/result.ts";
import type { IProvisionRepository } from "../../infrastructure/repositories/neo4j-provision/IProvision.repository.ts";
import type { Provision } from "../../domain/entities/provision.entity.ts";
import type { BrowseProvisionTreeDto } from "./browse-provision-tree.dto.ts";

export class BrowseProvisionTreeUseCase {
  constructor(private readonly provisions: IProvisionRepository) {}

  async execute(input: BrowseProvisionTreeDto): Promise<Result<Provision[], never>> {
    const children = input.parentProvisionId
      ? await this.provisions.findChildren(input.parentProvisionId)
      : await this.provisions.findTopLevelSections(input.instrumentRef);
    return Result.ok(children);
  }
}
