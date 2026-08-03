import { Result } from "../../shared/result.ts";
import type { PolicyNotFoundError } from "../../shared/errors.ts";
import type { Policy } from "../../domain/entities/policy.entity.ts";
import type { PolicySection } from "../../domain/types/policy-section.ts";
import type { CoverageEdge } from "../../domain/types/coverage-edge.ts";
import type { PolicyRepository } from "../../domain/repositories/policy.repository.ts";
import type { GetPolicyDetailDto } from "../../domain/schemas/get-policy-detail.schema.ts";

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
