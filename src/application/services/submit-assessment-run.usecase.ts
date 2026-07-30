import { Result } from "../../shared/result.js";
import type { ValidationError } from "../../shared/errors.js";
import type { AssessmentRunSubmission, PolicyPipelineService } from "../../domain/ports/policy-pipeline-service.js";
import { submitAssessmentRunSchema } from "../dtos/submit-assessment-run.dto.js";
import { validate } from "../validate.js";

export class SubmitAssessmentRunUseCase {
  constructor(private readonly pipeline: PolicyPipelineService) {}

  async execute(input: unknown): Promise<Result<AssessmentRunSubmission, ValidationError>> {
    const validated = validate(submitAssessmentRunSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const { hospitalProfileId, instrument, department, purpose } = validated.value;
    const result = await this.pipeline.submitAssessmentRun(hospitalProfileId, {
      instrument,
      department,
      purpose,
    });
    return Result.ok(result);
  }
}
