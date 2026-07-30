import { Result } from "../../shared/result.js";
import type { ValidationError } from "../../shared/errors.js";
import type { AssessmentRunNotFoundError } from "../../domain/errors/assessment.errors.js";
import type { AssessmentRun } from "../../domain/types/assessment-run.js";
import type { AssessmentRepository } from "../../domain/repositories/assessment.repository.js";
import { getRunSchema } from "../dtos/get-run.dto.js";
import { validate } from "../validate.js";

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
