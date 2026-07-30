import { Result } from "../../domain/shared/result.js";
import type { ValidationError } from "../shared/errors.js";
import type { AssessmentRunNotFoundError } from "../../domain/assessment/assessment.errors.js";
import type { AssessmentRun } from "../../domain/assessment/assessment-run.js";
import type { AssessmentRepository } from "../../domain/assessment/assessment.repository.js";
import { getRunSchema } from "./dto/get-run.dto.js";
import { validate } from "../shared/validate.js";

export class GetRunUseCase {
  constructor(private readonly assessments: AssessmentRepository) {}

  async execute(
    input: unknown,
  ): Promise<Result<AssessmentRun, ValidationError | AssessmentRunNotFoundError>> {
    const validated = validate(getRunSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    return this.assessments.findRunById(validated.value.runId);
  }
}
