import { Result } from "../../shared/result.ts";
import type { AssessmentRunSubmission, PolicyPipelineService } from "../../domain/ports/policy-pipeline-service.ts";
import type { SubmitAssessmentRunDto } from "../../domain/schemas/submit-assessment-run.schema.ts";

export class SubmitAssessmentRunUseCase {
  constructor(private readonly pipeline: PolicyPipelineService) {}

  async execute(input: SubmitAssessmentRunDto): Promise<Result<AssessmentRunSubmission, never>> {
    const { instrument, department, purpose } = input;
    const result = await this.pipeline.submitAssessmentRun({
      instrument,
      department,
      purpose,
    });
    return Result.ok(result);
  }
}
