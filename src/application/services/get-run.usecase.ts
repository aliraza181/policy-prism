import type { Result } from "../../shared/result.ts";
import type { AssessmentRunNotFoundError } from "../../shared/errors.ts";
import type { AssessmentRun } from "../../domain/types/assessment-run.ts";
import type { AssessmentRepository } from "../../domain/repositories/assessment.repository.ts";
import type { GetRunDto } from "../../domain/schemas/get-run.schema.ts";

export class GetRunUseCase {
  constructor(private readonly assessments: AssessmentRepository) {}

  async execute(input: GetRunDto): Promise<Result<AssessmentRun, AssessmentRunNotFoundError>> {
    return this.assessments.findRunById(input.runId);
  }
}
