import { Result } from "../../shared/result.ts";
import type {
  IProvisionRepository,
  ProvisionListResult,
} from "../../infrastructure/repositories/neo4j-provision/IProvision.repository.ts";
import type { ListProvisionsDto } from "./list-provisions.dto.ts";

export class ListProvisionsUseCase {
  constructor(private readonly provisions: IProvisionRepository) {}

  async execute(input: ListProvisionsDto): Promise<Result<ProvisionListResult, never>> {
    const page = await this.provisions.listAll(input);
    return Result.ok(page);
  }
}
