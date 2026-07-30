import { Result } from "../../shared/result.js";
import type { PolicyNotFoundError } from "../../domain/errors/policy.errors.js";
import type { Policy } from "../../domain/entities/policy.entity.js";
import type { PolicySection } from "../../domain/types/policy-section.js";
import type { CoverageEdge } from "../../domain/types/coverage-edge.js";
import type { PolicyRepository } from "../../domain/repositories/policy.repository.js";
import type { GetPolicyDetailDto } from "../dtos/get-policy-detail.dto.js";

export interface PolicyDetail {
  policy: Policy;
  sections: PolicySection[];
  coverageEdges: CoverageEdge[];
}

export class GetPolicyDetailUseCase {
  constructor(private readonly policies: PolicyRepository) {}

  async execute(input: GetPolicyDetailDto): Promise<Result<PolicyDetail, PolicyNotFoundError>> {
    const { policyId } = input;
    const policyResult = await this.policies.findById(policyId);
    if (policyResult.isErr) {
      return Result.err(policyResult.error);
    }

    const [sections, coverageEdges] = await Promise.all([
      this.policies.findSections(policyId),
      this.policies.findCoverageEdges(policyId),
    ]);

    return Result.ok({ policy: policyResult.value, sections, coverageEdges });
  }
}
