import type { Request, Response } from "express";

import type { UploadPolicyUseCase } from "../../application/services/upload-policy.usecase.ts";
import type { GetJobStatusUseCase } from "../../application/services/get-job-status.usecase.ts";
import type { ListPoliciesUseCase } from "../../application/services/list-policies.usecase.ts";
import type { GetPolicyDetailUseCase } from "../../application/services/get-policy-detail.usecase.ts";
import type { UploadPolicyDto } from "../../domain/schemas/upload-policy.schema.ts";
import type { GetJobStatusDto } from "../../domain/schemas/get-job-status.schema.ts";
import type { GetPolicyDetailDto } from "../../domain/schemas/get-policy-detail.schema.ts";
import { Result } from "../../shared/result.ts";
import { sendResult } from "../result-to-response.ts";

export class PolicyController {
  constructor(
    private readonly uploadPolicy: UploadPolicyUseCase,
    private readonly getJobStatus: GetJobStatusUseCase,
    private readonly listPolicies: ListPoliciesUseCase,
    private readonly getPolicyDetail: GetPolicyDetailUseCase,
  ) {}

  uploadHandler = async (req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as UploadPolicyDto;
    const input: UploadPolicyDto = {
      fileName: validated.fileName,
      contentType: validated.contentType,
      sizeBytes: validated.sizeBytes,
      sourceUri: validated.sourceUri,
    };
    const result = await this.uploadPolicy.execute(input, req.file!.buffer);
    sendResult(res, result);
  };

  getJobStatusHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as GetJobStatusDto;
    const input: GetJobStatusDto = { jobId: validated.jobId };
    const result = await this.getJobStatus.execute(input);
    sendResult(res, result);
  };

  listPoliciesHandler = async (_req: Request, res: Response): Promise<void> => {
    const policies = await this.listPolicies.execute();
    res.status(200).json(policies.map((policy) => policy.toPublic()));
  };

  getPolicyDetailHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as GetPolicyDetailDto;
    const input: GetPolicyDetailDto = { policyId: validated.policyId };
    const result = await this.getPolicyDetail.execute(input);
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
