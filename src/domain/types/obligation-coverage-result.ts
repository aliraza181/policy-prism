import type { ObligationContext } from "./obligation-context.ts";
import type { ObligationCoverageMapping } from "./obligation-coverage-mapping.ts";

export interface ObligationCoverageResult {
  context: ObligationContext;
  mappings: ObligationCoverageMapping[];
}
