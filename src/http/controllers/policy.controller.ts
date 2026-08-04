import type { Request, Response } from "express";

import type { UploadPolicyUseCase } from "../../application/upload-policy/upload-policy.usecase.ts";
import type { AuthorPolicyUseCase } from "../../application/author-policy/author-policy.usecase.ts";
import type { GetJobStatusUseCase } from "../../application/get-job-status/get-job-status.usecase.ts";
import type { ListPoliciesUseCase } from "../../application/list-policies/list-policies.usecase.ts";
import type { GetPolicyDetailUseCase } from "../../application/get-policy-detail/get-policy-detail.usecase.ts";
import type { UploadPolicyDto } from "../../application/upload-policy/upload-policy.dto.ts";
import type { AuthorPolicyDto } from "../../application/author-policy/author-policy.dto.ts";
import type { GetJobStatusDto } from "../../application/get-job-status/get-job-status.dto.ts";
import type { GetPolicyDetailDto } from "../../application/get-policy-detail/get-policy-detail.dto.ts";
import { uploadPolicySchema } from "../../domain/schemas/upload-policy.schema.ts";
import { authorPolicySchema } from "../../domain/schemas/author-policy.schema.ts";
import { getJobStatusSchema } from "../../domain/schemas/get-job-status.schema.ts";
import { getPolicyDetailSchema } from "../../domain/schemas/get-policy-detail.schema.ts";
import { Result } from "../../shared/result.ts";
import { parseOrThrow } from "../parse-request.ts";
import { sendResult } from "../result-to-response.ts";

export class PolicyController {
  constructor(
    private readonly uploadPolicy: UploadPolicyUseCase,
    private readonly authorPolicy: AuthorPolicyUseCase,
    private readonly getJobStatus: GetJobStatusUseCase,
    private readonly listPolicies: ListPoliciesUseCase,
    private readonly getPolicyDetail: GetPolicyDetailUseCase,
  ) {}

  // multer runs first (wired in the router), so req.file is already
  // populated by the time this validates - a missing file fails validation
  // here (fileName required) rather than needing a separate manual check.
  uploadHandler = async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    const body = req.body as { sourceUri?: unknown; hospitalProfileId?: unknown };
    const validated: UploadPolicyDto = parseOrThrow(uploadPolicySchema, {
      fileName: file?.originalname,
      contentType: file?.mimetype,
      sizeBytes: file?.size,
      sourceUri: typeof body.sourceUri === "string" ? body.sourceUri : undefined,
      hospitalProfileId: typeof body.hospitalProfileId === "string" ? body.hospitalProfileId : undefined,
    });
    const result = await this.uploadPolicy.execute(validated, req.file!.buffer);
    sendResult(res, result);
  };

  authorHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: AuthorPolicyDto = parseOrThrow(authorPolicySchema, req.body);
    const result = await this.authorPolicy.execute(validated);
    sendResult(res, result);
  };

  getJobStatusHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: GetJobStatusDto = parseOrThrow(getJobStatusSchema, { jobId: req.params.jobId });
    const result = await this.getJobStatus.execute(validated);
    sendResult(res, result);
  };

  listPoliciesHandler = async (_req: Request, res: Response): Promise<void> => {
    const policies = await this.listPolicies.execute();
    res.status(200).json(policies.map((policy) => policy.toPublic()));
  };

  getPolicyDetailHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: GetPolicyDetailDto = parseOrThrow(getPolicyDetailSchema, { policyId: req.params.policyId });
    const result = await this.getPolicyDetail.execute(validated);
    sendResult(
      res,
      result.success
        ? Result.ok({
            policy: result.data.policy.toPublic(),
            sections: result.data.sections,
            coverageEdges: result.data.coverageEdges,
          })
        : result,
    );
  };
}
