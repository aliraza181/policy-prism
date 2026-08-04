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

export interface AuthorPolicyInput {
  title: string;
  bodyText: string;
  department?: string | undefined;
  owner?: string | undefined;
  policyNumber?: string | undefined;
  effectiveDate?: string | undefined;
  nextReviewDate?: string | undefined;
  keywords?: string[] | undefined;
  revisionType?: string | undefined;
  hospitalProfileId?: string | undefined;
}

/**
 * Proxies to the Python policy-intake/assessment service
 * (pipeline/prism/policy/service.py), which owns everything TS genuinely
 * lacks: PDF/DOCX parsing, LLM extraction, embeddings, and the gap engine.
 *
 * Status/detail reads are deliberately NOT here - AssessmentRun and Gap
 * live in Neo4j, which TS can already read directly (see
 * infrastructure/repositories/neo4j-assessment/), same as every other
 * catalogue read. Only job status is proxied (getJobStatus) because that
 * lives in Postgres, which TS has no adapter for at all.
 */
export interface IPolicyPipelineService {
  submitUpload(
    file: Buffer,
    fileName: string,
    contentType: string,
    sourceUri?: string,
    hospitalProfileId?: string,
  ): Promise<PolicyIntakeUploadResult>;
  submitAuthoredPolicy(input: AuthorPolicyInput): Promise<PolicyIntakeUploadResult>;
  getJobStatus(jobId: string): Promise<PolicyIntakeJobStatus>;
  submitAssessmentRun(options: {
    hospitalProfileId: string;
    instrument?: string | undefined;
    department?: string | undefined;
    purpose?: string | undefined;
  }): Promise<AssessmentRunSubmission>;
}
