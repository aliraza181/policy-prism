import { Result } from "../../shared/result.ts";
import type { Gap } from "../../domain/types/gap.ts";
import type { IAssessmentRepository } from "../../infrastructure/repositories/neo4j-assessment/IAssessment.repository.ts";
import type { ListGapsDto } from "./list-gaps.dto.ts";

export class ListGapsUseCase {
  constructor(private readonly assessments: IAssessmentRepository) {}

  async execute(input: ListGapsDto): Promise<Result<Gap[], never>> {
    const gaps = await this.assessments.listGaps(input);
    return Result.ok(gaps);
  }
}
