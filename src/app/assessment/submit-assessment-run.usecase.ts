import { Result } from "../../domain/shared/result.js";
import type { ValidationError } from "../shared/errors.js";
import type { AssessmentRunSubmission, PolicyPipelineService } from "../../domain/policy/policy-pipeline-service.js";
import { submitAssessmentRunSchema } from "./dto/submit-assessment-run.dto.js";
import { validate } from "../shared/validate.js";

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
