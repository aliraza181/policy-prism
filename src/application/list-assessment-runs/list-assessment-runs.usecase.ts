import type { IAssessmentRepository } from "../../infrastructure/repositories/neo4j-assessment/IAssessment.repository.ts";
import type { AssessmentRun } from "../../domain/types/assessment-run.ts";

export class ListAssessmentRunsUseCase {
  constructor(private readonly assessments: IAssessmentRepository) {}

  async execute(hospitalProfileId?: string): Promise<AssessmentRun[]> {
    return this.assessments.listRuns(hospitalProfileId);
  }
}
