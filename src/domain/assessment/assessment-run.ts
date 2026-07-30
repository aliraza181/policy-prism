export interface AssessmentRun {
  id: string;
  hospitalProfileId: string;
  runPurpose: string;
  status: string;
  gapCount: number | null;
  coveredCount: number | null;
  runStartedAt: string;
}
