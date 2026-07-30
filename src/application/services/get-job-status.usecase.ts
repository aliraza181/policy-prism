import { Result } from "../../shared/result.js";
import type { PolicyIntakeJobStatus, PolicyPipelineService } from "../../domain/ports/policy-pipeline-service.js";
import type { GetJobStatusDto } from "../../domain/types/get-job-status.js";

export class GetJobStatusUseCase {
  constructor(private readonly pipeline: PolicyPipelineService) {}

  async execute(input: GetJobStatusDto): Promise<Result<PolicyIntakeJobStatus, never>> {
    const status = await this.pipeline.getJobStatus(input.jobId);
    return Result.ok(status);
  }
}
