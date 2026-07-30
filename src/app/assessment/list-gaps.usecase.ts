import { Result } from "../../domain/shared/result.js";
import type { ValidationError } from "../shared/errors.js";
import type { Gap } from "../../domain/assessment/gap.js";
import type { AssessmentRepository } from "../../domain/assessment/assessment.repository.js";
import { listGapsSchema } from "./dto/list-gaps.dto.js";
import { validate } from "../shared/validate.js";

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
