import { Result } from "../../shared/result.ts";
import type {
  IPolicyPipelineService,
  PolicyIntakeJobStatus,
} from "../../infrastructure/services/http-policy-pipeline-service/IPolicyPipelineService.ts";
import type { GetJobStatusDto } from "./get-job-status.dto.ts";

export class GetJobStatusUseCase {
  constructor(private readonly pipeline: IPolicyPipelineService) {}

  async execute(input: GetJobStatusDto): Promise<Result<PolicyIntakeJobStatus, never>> {
    const status = await this.pipeline.getJobStatus(input.jobId);
    return Result.ok(status);
  }
}
