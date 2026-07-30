import { Result } from "../../domain/shared/result.js";
import type { ValidationError } from "../shared/errors.js";
import type { PolicyNotFoundError } from "../../domain/policy/policy.errors.js";
import type { Policy } from "../../domain/policy/policy.entity.js";
import type { PolicySection } from "../../domain/policy/policy-section.js";
import type { CoverageEdge } from "../../domain/policy/coverage-edge.js";
import type { PolicyRepository } from "../../domain/policy/policy.repository.js";
import { getPolicyDetailSchema } from "./dto/get-policy-detail.dto.js";
import { validate } from "../shared/validate.js";

export interface PolicyDetail {
  policy: Policy;
  sections: PolicySection[];
  coverageEdges: CoverageEdge[];
}

export class GetPolicyDetailUseCase {
  constructor(private readonly policies: PolicyRepository) {}

  async execute(
    input: unknown,
  ): Promise<Result<PolicyDetail, ValidationError | PolicyNotFoundError>> {
    const validated = validate(getPolicyDetailSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const { policyId } = validated.value;
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
