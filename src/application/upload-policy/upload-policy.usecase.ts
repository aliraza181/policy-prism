import { Result } from "../../shared/result.ts";
import type {
  IPolicyPipelineService,
  PolicyIntakeUploadResult,
} from "../../infrastructure/services/http-policy-pipeline-service/IPolicyPipelineService.ts";
import type { UploadPolicyDto } from "./upload-policy.dto.ts";

export class UploadPolicyUseCase {
  constructor(private readonly pipeline: IPolicyPipelineService) {}

  async execute(input: UploadPolicyDto, file: Buffer): Promise<Result<PolicyIntakeUploadResult, never>> {
    const { fileName, contentType, sourceUri, hospitalProfileId } = input;
    const result = await this.pipeline.submitUpload(file, fileName, contentType, sourceUri, hospitalProfileId);
    return Result.ok(result);
  }
}
