import { Result } from "../../shared/result.js";
import type { ValidationError } from "../../shared/errors.js";
import type { ProvisionRepository } from "../../domain/repositories/provision.repository.js";
import type { Provision } from "../../domain/entities/provision.entity.js";
import { searchCatalogueSchema } from "../dtos/search-catalogue.dto.js";
import { validate } from "../validate.js";

export class SearchCatalogueUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(input: unknown): Promise<Result<Provision[], ValidationError>> {
    const validated = validate(searchCatalogueSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const results = await this.provisions.search(validated.value);
    return Result.ok(results);
  }
}
