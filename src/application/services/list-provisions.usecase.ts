import { Result } from "../../shared/result.js";
import type { ValidationError } from "../../shared/errors.js";
import type { ProvisionListResult, ProvisionRepository } from "../../domain/repositories/provision.repository.js";
import { listProvisionsSchema } from "../dtos/list-provisions.dto.js";
import { validate } from "../validate.js";

export class ListProvisionsUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(input: unknown): Promise<Result<ProvisionListResult, ValidationError>> {
    const validated = validate(listProvisionsSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const page = await this.provisions.listAll(validated.value);
    return Result.ok(page);
  }
}
