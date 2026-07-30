import { Result } from "../../shared/result.js";
import type { ValidationError } from "../../shared/errors.js";
import type { PolicyIntakeUploadResult, PolicyPipelineService } from "../../domain/ports/policy-pipeline-service.js";
import { uploadPolicySchema } from "../dtos/upload-policy.dto.js";
import { validate } from "../validate.js";

export class UploadPolicyUseCase {
  constructor(private readonly pipeline: PolicyPipelineService) {}

  async execute(input: unknown, file: Buffer): Promise<Result<PolicyIntakeUploadResult, ValidationError>> {
    const validated = validate(uploadPolicySchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const { fileName, contentType, sourceUri } = validated.value;
    const result = await this.pipeline.submitUpload(file, fileName, contentType, sourceUri);
    return Result.ok(result);
  }
}
