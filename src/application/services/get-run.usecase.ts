import type { Result } from "../../shared/result.js";
import type { AssessmentRunNotFoundError } from "../../domain/errors/assessment.errors.js";
import type { AssessmentRun } from "../../domain/types/assessment-run.js";
import type { AssessmentRepository } from "../../domain/repositories/assessment.repository.js";
import type { GetRunDto } from "../../domain/types/get-run.js";

export class GetRunUseCase {
  constructor(private readonly assessments: AssessmentRepository) {}

  async execute(input: GetRunDto): Promise<Result<AssessmentRun, AssessmentRunNotFoundError>> {
    return this.assessments.findRunById(input.runId);
  }
}
