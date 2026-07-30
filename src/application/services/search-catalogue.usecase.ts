import { Result } from "../../shared/result.js";
import type { ProvisionRepository } from "../../domain/repositories/provision.repository.js";
import type { Provision } from "../../domain/entities/provision.entity.js";
import type { SearchCatalogueDto } from "../../domain/types/search-catalogue.js";

export class SearchCatalogueUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(input: SearchCatalogueDto): Promise<Result<Provision[], never>> {
    const results = await this.provisions.search(input);
    return Result.ok(results);
  }
}
