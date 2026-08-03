import type { Result } from "../../shared/result.ts";
import type { AssessmentRun } from "../types/assessment-run.ts";
import type { Gap } from "../types/gap.ts";
import type { AssessmentRunNotFoundError } from "../../shared/errors.ts";

export interface ListGapsQuery {
  runId: string;
  gapType?: string | undefined;
  tier1CriticalOnly?: boolean | undefined;
}

export interface AssessmentRepository {
  findRunById(id: string): Promise<Result<AssessmentRun, AssessmentRunNotFoundError>>;
  listGaps(query: ListGapsQuery): Promise<Gap[]>;
}
