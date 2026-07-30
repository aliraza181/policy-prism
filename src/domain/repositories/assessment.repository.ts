import type { Result } from "../../shared/result.js";
import type { AssessmentRun } from "../types/assessment-run.js";
import type { Gap } from "../types/gap.js";
import type { AssessmentRunNotFoundError } from "../errors/assessment.errors.js";

export interface ListGapsQuery {
  runId: string;
  gapType?: string | undefined;
  tier1CriticalOnly?: boolean | undefined;
}

export interface AssessmentRepository {
  findRunById(id: string): Promise<Result<AssessmentRun, AssessmentRunNotFoundError>>;
  listGaps(query: ListGapsQuery): Promise<Gap[]>;
}
