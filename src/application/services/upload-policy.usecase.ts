import { Result } from "../../shared/result.js";
import type { PolicyIntakeUploadResult, PolicyPipelineService } from "../../domain/ports/policy-pipeline-service.js";
import type { UploadPolicyDto } from "../../domain/types/upload-policy.js";

export class UploadPolicyUseCase {
  constructor(private readonly pipeline: PolicyPipelineService) {}

  async execute(input: UploadPolicyDto, file: Buffer): Promise<Result<PolicyIntakeUploadResult, never>> {
    const { fileName, contentType, sourceUri } = input;
    const result = await this.pipeline.submitUpload(file, fileName, contentType, sourceUri);
    return Result.ok(result);
  }
}
