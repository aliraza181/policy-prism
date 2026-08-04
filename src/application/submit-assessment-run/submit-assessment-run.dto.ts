export interface SubmitAssessmentRunDto {
  hospitalProfileId: string;
  instrument?: string | undefined;
  department?: string | undefined;
  purpose?: string | undefined;
}
