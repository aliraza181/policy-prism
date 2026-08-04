import type { Result } from "../../shared/result.ts";
import type { AssessmentRunNotFoundError } from "../../shared/errors.ts";
import type { AssessmentRun } from "../../domain/types/assessment-run.ts";
import type { IAssessmentRepository } from "../../infrastructure/repositories/neo4j-assessment/IAssessment.repository.ts";
import type { GetRunDto } from "./get-run.dto.ts";

export class GetRunUseCase {
  constructor(private readonly assessments: IAssessmentRepository) {}

  async execute(input: GetRunDto): Promise<Result<AssessmentRun, AssessmentRunNotFoundError>> {
    return this.assessments.findRunById(input.runId);
  }
}
