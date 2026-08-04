import { Result } from "../../shared/result.ts";
import type { IRagService, RagSearchResult } from "../../infrastructure/services/http-rag-service/IRagService.ts";
import type { SemanticSearchDto } from "./semantic-search.dto.ts";

export class SemanticSearchProvisionsUseCase {
  constructor(private readonly rag: IRagService) {}

  async execute(input: SemanticSearchDto): Promise<Result<RagSearchResult, never>> {
    const result = await this.rag.search(input.query, input.topK, input.synthesize);
    return Result.ok(result);
  }
}
