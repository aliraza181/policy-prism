import type { Request, Response } from "express";

import type { UploadPolicyUseCase } from "../../application/services/upload-policy.usecase.js";
import type { GetJobStatusUseCase } from "../../application/services/get-job-status.usecase.js";
import type { ListPoliciesUseCase } from "../../application/services/list-policies.usecase.js";
import type { GetPolicyDetailUseCase } from "../../application/services/get-policy-detail.usecase.js";
import type { UploadPolicyDto } from "../../application/dtos/upload-policy.dto.js";
import type { GetJobStatusDto } from "../../application/dtos/get-job-status.dto.js";
import type { GetPolicyDetailDto } from "../../application/dtos/get-policy-detail.dto.js";
import { sendResult } from "../result-to-response.js";

export class PolicyController {
  constructor(
    private readonly uploadPolicy: UploadPolicyUseCase,
    private readonly getJobStatus: GetJobStatusUseCase,
    private readonly listPolicies: ListPoliciesUseCase,
    private readonly getPolicyDetail: GetPolicyDetailUseCase,
  ) {}

  uploadHandler = async (req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as UploadPolicyDto;
    const result = await this.uploadPolicy.execute(input, req.file!.buffer);
    sendResult(res, result);
  };

  getJobStatusHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as GetJobStatusDto;
    const result = await this.getJobStatus.execute(input);
    sendResult(res, result);
  };

  listPoliciesHandler = async (_req: Request, res: Response): Promise<void> => {
    const policies = await this.listPolicies.execute();
    res.status(200).json(policies);
  };

  getPolicyDetailHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as GetPolicyDetailDto;
    const result = await this.getPolicyDetail.execute(input);
    sendResult(res, result);
  };
}
