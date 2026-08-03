import { Result } from "../../shared/result.ts";
import type { ProvisionRepository } from "../../domain/repositories/provision.repository.ts";
import type { Provision } from "../../domain/entities/provision.entity.ts";
import type { SearchCatalogueDto } from "../../domain/schemas/search-catalogue.schema.ts";

export class SearchCatalogueUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(input: SearchCatalogueDto): Promise<Result<Provision[], never>> {
    const results = await this.provisions.search(input);
    return Result.ok(results);
  }
}
