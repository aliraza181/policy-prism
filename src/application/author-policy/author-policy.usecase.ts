import { Result } from "../../shared/result.ts";
import type {
  IPolicyPipelineService,
  PolicyIntakeUploadResult,
} from "../../infrastructure/services/http-policy-pipeline-service/IPolicyPipelineService.ts";
import type { AuthorPolicyDto } from "./author-policy.dto.ts";

export class AuthorPolicyUseCase {
  constructor(private readonly pipeline: IPolicyPipelineService) {}

  async execute(input: AuthorPolicyDto): Promise<Result<PolicyIntakeUploadResult, never>> {
    const result = await this.pipeline.submitAuthoredPolicy(input);
    return Result.ok(result);
  }
}
