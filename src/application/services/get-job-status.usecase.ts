import { Result } from "../../shared/result.js";
import type { ValidationError } from "../../shared/errors.js";
import type { PolicyIntakeJobStatus, PolicyPipelineService } from "../../domain/ports/policy-pipeline-service.js";
import { getJobStatusSchema } from "../dtos/get-job-status.dto.js";
import { validate } from "../validate.js";

export class GetJobStatusUseCase {
  constructor(private readonly pipeline: PolicyPipelineService) {}

  async execute(input: unknown): Promise<Result<PolicyIntakeJobStatus, ValidationError>> {
    const validated = validate(getJobStatusSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const status = await this.pipeline.getJobStatus(validated.value.jobId);
    return Result.ok(status);
  }
}
