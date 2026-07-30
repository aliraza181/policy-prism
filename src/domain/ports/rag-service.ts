export interface RagMatch {
  provisionId: string;
  citationLabel: string;
  instrumentRef: string;
  level: string;
  parentProvisionId: string | null;
  text: string;
  score: number;
}

export interface RagSearchResult {
  answer: string;
  matches: RagMatch[];
}

export interface RagService {
  search(query: string, topK: number, synthesize: boolean): Promise<RagSearchResult>;
}
