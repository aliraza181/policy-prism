import { Result } from "../../shared/result.js";
import type { RagService, RagSearchResult } from "../../domain/ports/rag-service.js";
import type { SemanticSearchDto } from "../../domain/types/semantic-search.js";

export class SemanticSearchProvisionsUseCase {
  constructor(private readonly rag: RagService) {}

  async execute(input: SemanticSearchDto): Promise<Result<RagSearchResult, never>> {
    const result = await this.rag.search(input.query, input.topK, input.synthesize);
    return Result.ok(result);
  }
}
