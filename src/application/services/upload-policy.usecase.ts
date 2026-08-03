import { Result } from "../../shared/result.ts";
import type { PolicyIntakeUploadResult, PolicyPipelineService } from "../../domain/ports/policy-pipeline-service.ts";
import type { UploadPolicyDto } from "../../domain/schemas/upload-policy.schema.ts";

export class UploadPolicyUseCase {
  constructor(private readonly pipeline: PolicyPipelineService) {}

  async execute(input: UploadPolicyDto, file: Buffer): Promise<Result<PolicyIntakeUploadResult, never>> {
    const { fileName, contentType, sourceUri } = input;
    const result = await this.pipeline.submitUpload(file, fileName, contentType, sourceUri);
    return Result.ok(result);
  }
}
