export interface PolicyIntakeUploadResult {
  jobId: string;
  status: string;
  policyId: string | null;
}

export interface PolicyIntakeJobStatus {
  jobId: string;
  status: string;
  statusDetail: string | null;
  policyId: string | null;
  errorMessage: string | null;
}

export interface AssessmentRunSubmission {
  runId: string;
  status: string;
}

/**
 * Proxies to the Python policy-intake/assessment service
 * (pipeline/prism/policy/service.py), which owns everything TS genuinely
 * lacks: PDF/DOCX parsing, LLM extraction, embeddings, and the gap engine.
 *
 * Status/detail reads are deliberately NOT here - AssessmentRun and Gap
 * live in Neo4j, which TS can already read directly (see
 * domain/assessment/assessment.repository.ts), same as every other
 * catalogue read. Only job status is proxied (getJobStatus) because that
 * lives in Postgres, which TS has no adapter for at all.
 */
export interface PolicyPipelineService {
  submitUpload(file: Buffer, fileName: string, contentType: string, sourceUri?: string): Promise<PolicyIntakeUploadResult>;
  getJobStatus(jobId: string): Promise<PolicyIntakeJobStatus>;
  submitAssessmentRun(options?: {
    instrument?: string | undefined;
    department?: string | undefined;
    purpose?: string | undefined;
  }): Promise<AssessmentRunSubmission>;
}
