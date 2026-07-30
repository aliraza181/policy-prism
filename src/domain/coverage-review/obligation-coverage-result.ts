import type { ObligationContext } from "./obligation-context.js";
import type { ObligationCoverageMapping } from "./obligation-coverage-mapping.js";

export interface ObligationCoverageResult {
  context: ObligationContext;
  mappings: ObligationCoverageMapping[];
}
