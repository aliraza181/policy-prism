import { Result } from "../../shared/result.ts";
import type { RagService, RagSearchResult } from "../../domain/ports/rag-service.ts";
import type { SemanticSearchDto } from "../../domain/schemas/semantic-search.schema.ts";

export class SemanticSearchProvisionsUseCase {
  constructor(private readonly rag: RagService) {}

  async execute(input: SemanticSearchDto): Promise<Result<RagSearchResult, never>> {
    const result = await this.rag.search(input.query, input.topK, input.synthesize);
    return Result.ok(result);
  }
}
