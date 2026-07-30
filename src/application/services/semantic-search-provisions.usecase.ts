import { Result } from "../../shared/result.js";
import type { ValidationError } from "../../shared/errors.js";
import type { RagService, RagSearchResult } from "../../domain/ports/rag-service.js";
import { semanticSearchSchema } from "../dtos/semantic-search.dto.js";
import { validate } from "../validate.js";

export class SemanticSearchProvisionsUseCase {
  constructor(private readonly rag: RagService) {}

  async execute(input: unknown): Promise<Result<RagSearchResult, ValidationError>> {
    const validated = validate(semanticSearchSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const result = await this.rag.search(validated.value.query, validated.value.topK, validated.value.synthesize);
    return Result.ok(result);
  }
}
