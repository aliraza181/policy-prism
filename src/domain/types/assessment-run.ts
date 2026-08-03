export interface AssessmentRun {
  id: string;
  runPurpose: string;
  status: string;
  gapCount: number | null;
  coveredCount: number | null;
  runStartedAt: string;
}
