import type { Result } from "../shared/result.js";
import type { AssessmentRun } from "./assessment-run.js";
import type { Gap } from "./gap.js";
import type { AssessmentRunNotFoundError } from "./assessment.errors.js";

export interface ListGapsQuery {
  runId: string;
  gapType?: string | undefined;
  tier1CriticalOnly?: boolean | undefined;
}

export interface AssessmentRepository {
  findRunById(id: string): Promise<Result<AssessmentRun, AssessmentRunNotFoundError>>;
  listGaps(query: ListGapsQuery): Promise<Gap[]>;
}
