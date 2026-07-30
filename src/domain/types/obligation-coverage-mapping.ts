import type { CoverageEdge } from "./coverage-edge.js";

/**
 * A CoverageEdge, denormalized with the policy identity and the covering
 * section's own text - what the obligation-centric review page needs to
 * show "what the policy says" without a second round trip per mapping.
 */
export interface ObligationCoverageMapping extends CoverageEdge {
  policyId: string;
  policyTitle: string;
  sectionText: string;
}
