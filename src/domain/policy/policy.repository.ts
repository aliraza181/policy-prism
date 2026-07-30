import type { Result } from "../shared/result.js";
import type { Policy } from "./policy.entity.js";
import type { PolicySection } from "./policy-section.js";
import type { CoverageEdge } from "./coverage-edge.js";
import type { PolicyNotFoundError } from "./policy.errors.js";

export interface PolicyRepository {
  findById(id: string): Promise<Result<Policy, PolicyNotFoundError>>;
  listAll(): Promise<Policy[]>;
  findSections(policyId: string): Promise<PolicySection[]>;
  findCoverageEdges(policyId: string): Promise<CoverageEdge[]>;
}
