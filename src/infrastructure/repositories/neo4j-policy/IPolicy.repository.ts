import type { Result } from "../../../shared/result.ts";
import type { Policy } from "../../../domain/entities/policy.entity.ts";
import type { PolicySection } from "../../../domain/types/policy-section.ts";
import type { CoverageEdge } from "../../../domain/types/coverage-edge.ts";
import type { PolicyNotFoundError } from "../../../shared/errors.ts";

export interface IPolicyRepository {
  findById(id: string): Promise<Result<Policy, PolicyNotFoundError>>;
  listAll(): Promise<Policy[]>;
  findSections(policyId: string): Promise<PolicySection[]>;
  findCoverageEdges(policyId: string): Promise<CoverageEdge[]>;
}
