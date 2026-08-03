import type { Result } from "../../shared/result.ts";
import type { Policy } from "../entities/policy.entity.ts";
import type { PolicySection } from "../types/policy-section.ts";
import type { CoverageEdge } from "../types/coverage-edge.ts";
import type { PolicyNotFoundError } from "../../shared/errors.ts";

export interface PolicyRepository {
  findById(id: string): Promise<Result<Policy, PolicyNotFoundError>>;
  listAll(): Promise<Policy[]>;
  findSections(policyId: string): Promise<PolicySection[]>;
  findCoverageEdges(policyId: string): Promise<CoverageEdge[]>;
}
