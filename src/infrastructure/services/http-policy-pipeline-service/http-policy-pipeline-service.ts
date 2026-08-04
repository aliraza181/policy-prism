import type {
  AssessmentRunSubmission,
  AuthorPolicyInput,
  IPolicyPipelineService,
  PolicyIntakeJobStatus,
  PolicyIntakeUploadResult,
} from "./IPolicyPipelineService.ts";

export interface HttpPolicyPipelineServiceConfig {
  baseUrl: string;
}

/**
 * Proxies to the Python policy-intake/assessment microservice
 * (pipeline/prism/policy/service.py), which owns PDF/DOCX parsing, LLM
 * extraction, embeddings, and the gap engine - this adapter's only job is
 * the HTTP call, same shape as HttpRagService.
 */
export class HttpPolicyPipelineService implements IPolicyPipelineService {
  constructor(private readonly config: HttpPolicyPipelineServiceConfig) {}

  async submitUpload(
    file: Buffer,
    fileName: string,
    contentType: string,
    sourceUri?: string,
    hospitalProfileId?: string,
  ): Promise<PolicyIntakeUploadResult> {
    const form = new FormData();
    form.append("file", new Blob([file], { type: contentType }), fileName);
    if (sourceUri) {
      form.append("sourceUri", sourceUri);
    }
    if (hospitalProfileId) {
      form.append("hospitalProfileId", hospitalProfileId);
    }

    const response = await fetch(new URL("/intake/upload", this.config.baseUrl), {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Policy intake upload failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as { jobId: string; status: string; policyId: string | null };
    return { jobId: data.jobId, status: data.status, policyId: data.policyId };
  }

  async submitAuthoredPolicy(input: AuthorPolicyInput): Promise<PolicyIntakeUploadResult> {
    const response = await fetch(new URL("/intake/author", this.config.baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: input.title,
        bodyText: input.bodyText,
        department: input.department,
        owner: input.owner,
        policyNumber: input.policyNumber,
        effectiveDate: input.effectiveDate,
        nextReviewDate: input.nextReviewDate,
        keywords: input.keywords ?? [],
        revisionType: input.revisionType,
        hospitalProfileId: input.hospitalProfileId,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Authored policy submission failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as { jobId: string; status: string; policyId: string | null };
    return { jobId: data.jobId, status: data.status, policyId: data.policyId };
  }

  async getJobStatus(jobId: string): Promise<PolicyIntakeJobStatus> {
    const response = await fetch(new URL(`/intake/jobs/${jobId}`, this.config.baseUrl));

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Policy intake job status request failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as {
      jobId: string;
      status: string;
      statusDetail: string | null;
      policyId: string | null;
      errorMessage: string | null;
    };
    return {
      jobId: data.jobId,
      status: data.status,
      statusDetail: data.statusDetail,
      policyId: data.policyId,
      errorMessage: data.errorMessage,
    };
  }

  async submitAssessmentRun(options: {
    hospitalProfileId: string;
    instrument?: string | undefined;
    department?: string | undefined;
    purpose?: string | undefined;
  }): Promise<AssessmentRunSubmission> {
    const response = await fetch(new URL("/assessment/runs", this.config.baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hospitalProfileId: options.hospitalProfileId,
        instrument: options.instrument,
        department: options.department,
        purpose: options.purpose,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Assessment run submission failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as { runId: string; status: string };
    return { runId: data.runId, status: data.status };
  }
}
