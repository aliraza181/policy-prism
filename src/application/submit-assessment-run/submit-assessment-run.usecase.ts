import { Result } from "../../shared/result.ts";
import type {
  AssessmentRunSubmission,
  IPolicyPipelineService,
} from "../../infrastructure/services/http-policy-pipeline-service/IPolicyPipelineService.ts";
import type { SubmitAssessmentRunDto } from "./submit-assessment-run.dto.ts";

export class SubmitAssessmentRunUseCase {
  constructor(private readonly pipeline: IPolicyPipelineService) {}

  async execute(input: SubmitAssessmentRunDto): Promise<Result<AssessmentRunSubmission, never>> {
    const { hospitalProfileId, instrument, department, purpose } = input;
    const result = await this.pipeline.submitAssessmentRun({
      hospitalProfileId,
      instrument,
      department,
      purpose,
    });
    return Result.ok(result);
  }
}
