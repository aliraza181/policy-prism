import type { z } from "zod";
import type { semanticSearchSchema } from "../schemas/semantic-search.schema.js";

export type SemanticSearchDto = z.infer<typeof semanticSearchSchema>;
