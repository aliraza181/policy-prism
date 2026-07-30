import type { Result } from "../../shared/result.js";
import type { Policy } from "../entities/policy.entity.js";
import type { PolicySection } from "../types/policy-section.js";
import type { CoverageEdge } from "../types/coverage-edge.js";
import type { PolicyNotFoundError } from "../errors/policy.errors.js";

export interface PolicyRepository {
  findById(id: string): Promise<Result<Policy, PolicyNotFoundError>>;
  listAll(): Promise<Policy[]>;
  findSections(policyId: string): Promise<PolicySection[]>;
  findCoverageEdges(policyId: string): Promise<CoverageEdge[]>;
}
