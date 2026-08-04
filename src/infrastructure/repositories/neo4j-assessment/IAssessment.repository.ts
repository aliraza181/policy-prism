import type { Result } from "../../../shared/result.ts";
import type { AssessmentRun } from "../../../domain/types/assessment-run.ts";
import type { Gap } from "../../../domain/types/gap.ts";
import type { AssessmentRunNotFoundError } from "../../../shared/errors.ts";

export interface ListGapsQuery {
  runId: string;
  gapType?: string | undefined;
  tier1CriticalOnly?: boolean | undefined;
}

export interface IAssessmentRepository {
  findRunById(id: string): Promise<Result<AssessmentRun, AssessmentRunNotFoundError>>;
  listRuns(hospitalProfileId?: string): Promise<AssessmentRun[]>;
  listGaps(query: ListGapsQuery): Promise<Gap[]>;
}
