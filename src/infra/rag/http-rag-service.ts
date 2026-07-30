import type { RagService, RagSearchResult } from "../../domain/rag/rag-service.js";

export interface HttpRagServiceConfig {
  baseUrl: string;
}

/**
 * Proxies to the Python RAG microservice (pipeline/prism/rag/service.py),
 * which owns embeddings (local model) and answer synthesis (MiniMax) -
 * this adapter's only job is the HTTP call.
 */
export class HttpRagService implements RagService {
  constructor(private readonly config: HttpRagServiceConfig) {}

  async search(query: string, topK: number, synthesize: boolean): Promise<RagSearchResult> {
    const response = await fetch(new URL("/semantic-search", this.config.baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, topK, synthesize }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`RAG service request failed (${response.status}): ${body}`);
    }

    return (await response.json()) as RagSearchResult;
  }
}
