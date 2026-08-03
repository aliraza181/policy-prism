import { Result } from "../../shared/result.ts";
import type { ProvisionListResult, ProvisionRepository } from "../../domain/repositories/provision.repository.ts";
import type { ListProvisionsDto } from "../../domain/schemas/list-provisions.schema.ts";

export class ListProvisionsUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(input: ListProvisionsDto): Promise<Result<ProvisionListResult, never>> {
    const page = await this.provisions.listAll(input);
    return Result.ok(page);
  }
}
