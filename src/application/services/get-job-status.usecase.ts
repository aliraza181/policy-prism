import { Result } from "../../shared/result.ts";
import type { PolicyIntakeJobStatus, PolicyPipelineService } from "../../domain/ports/policy-pipeline-service.ts";
import type { GetJobStatusDto } from "../../domain/schemas/get-job-status.schema.ts";

export class GetJobStatusUseCase {
  constructor(private readonly pipeline: PolicyPipelineService) {}

  async execute(input: GetJobStatusDto): Promise<Result<PolicyIntakeJobStatus, never>> {
    const status = await this.pipeline.getJobStatus(input.jobId);
    return Result.ok(status);
  }
}
