import { Result } from "../../shared/result.js";
import type { ValidationError } from "../../shared/errors.js";
import type { Gap } from "../../domain/types/gap.js";
import type { AssessmentRepository } from "../../domain/repositories/assessment.repository.js";
import { listGapsSchema } from "../dtos/list-gaps.dto.js";
import { validate } from "../validate.js";

export class ListGapsUseCase {
  constructor(private readonly assessments: AssessmentRepository) {}

  async execute(input: unknown): Promise<Result<Gap[], ValidationError>> {
    const validated = validate(listGapsSchema, input);
    if (validated.isErr) {
      return Result.err(validated.error);
    }

    const gaps = await this.assessments.listGaps(validated.value);
    return Result.ok(gaps);
  }
}
