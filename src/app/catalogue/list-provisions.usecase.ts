import { Result } from "../../domain/shared/result.js";
import type { ValidationError } from "../shared/errors.js";
import type { ProvisionListResult, ProvisionRepository } from "../../domain/provision/provision.repository.js";
import { listProvisionsSchema } from "./dto/list-provisions.dto.js";
import { validate } from "../shared/validate.js";

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
