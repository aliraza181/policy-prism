import { Result } from "../../shared/result.js";
import type { AssessmentRunSubmission, PolicyPipelineService } from "../../domain/ports/policy-pipeline-service.js";
import type { SubmitAssessmentRunDto } from "../../domain/types/submit-assessment-run.js";

export class SubmitAssessmentRunUseCase {
  constructor(private readonly pipeline: PolicyPipelineService) {}

  async execute(input: SubmitAssessmentRunDto): Promise<Result<AssessmentRunSubmission, never>> {
    const { hospitalProfileId, instrument, department, purpose } = input;
    const result = await this.pipeline.submitAssessmentRun(hospitalProfileId, {
      instrument,
      department,
      purpose,
    });
    return Result.ok(result);
  }
}
