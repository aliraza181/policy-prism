import { Result } from "../../shared/result.ts";
import type { Gap } from "../../domain/types/gap.ts";
import type { AssessmentRepository } from "../../domain/repositories/assessment.repository.ts";
import type { ListGapsDto } from "../../domain/schemas/list-gaps.schema.ts";

export class ListGapsUseCase {
  constructor(private readonly assessments: AssessmentRepository) {}

  async execute(input: ListGapsDto): Promise<Result<Gap[], never>> {
    const gaps = await this.assessments.listGaps(input);
    return Result.ok(gaps);
  }
}
