import { Result } from "../../shared/result.js";
import type { Gap } from "../../domain/types/gap.js";
import type { AssessmentRepository } from "../../domain/repositories/assessment.repository.js";
import type { ListGapsDto } from "../dtos/list-gaps.dto.js";

export class ListGapsUseCase {
  constructor(private readonly assessments: AssessmentRepository) {}

  async execute(input: ListGapsDto): Promise<Result<Gap[], never>> {
    const gaps = await this.assessments.listGaps(input);
    return Result.ok(gaps);
  }
}
