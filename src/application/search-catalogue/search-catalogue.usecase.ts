import { Result } from "../../shared/result.ts";
import type { IProvisionRepository } from "../../infrastructure/repositories/neo4j-provision/IProvision.repository.ts";
import type { Provision } from "../../domain/entities/provision.entity.ts";
import type { SearchCatalogueDto } from "./search-catalogue.dto.ts";

export class SearchCatalogueUseCase {
  constructor(private readonly provisions: IProvisionRepository) {}

  async execute(input: SearchCatalogueDto): Promise<Result<Provision[], never>> {
    const results = await this.provisions.search(input);
    return Result.ok(results);
  }
}
