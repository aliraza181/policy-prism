import { Result } from "../../shared/result.ts";
import type { PolicyNotFoundError } from "../../shared/errors.ts";
import type { Policy } from "../../domain/entities/policy.entity.ts";
import type { PolicySection } from "../../domain/types/policy-section.ts";
import type { CoverageEdge } from "../../domain/types/coverage-edge.ts";
import type { IPolicyRepository } from "../../infrastructure/repositories/neo4j-policy/IPolicy.repository.ts";
import type { GetPolicyDetailDto } from "./get-policy-detail.dto.ts";

export interface PolicyDetail {
  policy: Policy;
  sections: PolicySection[];
  coverageEdges: CoverageEdge[];
}

export class GetPolicyDetailUseCase {
  constructor(private readonly policies: IPolicyRepository) {}

  async execute(input: GetPolicyDetailDto): Promise<Result<PolicyDetail, PolicyNotFoundError>> {
    const { policyId } = input;
    const policyResult = await this.policies.findById(policyId);
    if (!policyResult.success) {
      return Result.err(policyResult.error);
    }

    const [sections, coverageEdges] = await Promise.all([
      this.policies.findSections(policyId),
      this.policies.findCoverageEdges(policyId),
    ]);

    return Result.ok({ policy: policyResult.data, sections, coverageEdges });
  }
}
