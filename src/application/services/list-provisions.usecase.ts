import { Result } from "../../shared/result.js";
import type { ProvisionListResult, ProvisionRepository } from "../../domain/repositories/provision.repository.js";
import type { ListProvisionsDto } from "../dtos/list-provisions.dto.js";

export class ListProvisionsUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(input: ListProvisionsDto): Promise<Result<ProvisionListResult, never>> {
    const page = await this.provisions.listAll(input);
    return Result.ok(page);
  }
}
