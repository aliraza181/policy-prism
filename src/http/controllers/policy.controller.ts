import type { Request, Response } from "express";

import type { UploadPolicyUseCase } from "../../application/services/upload-policy.usecase.js";
import type { GetJobStatusUseCase } from "../../application/services/get-job-status.usecase.js";
import type { ListPoliciesUseCase } from "../../application/services/list-policies.usecase.js";
import type { GetPolicyDetailUseCase } from "../../application/services/get-policy-detail.usecase.js";
import { sendResult } from "../result-to-response.js";

export class PolicyController {
  constructor(
    private readonly uploadPolicy: UploadPolicyUseCase,
    private readonly getJobStatus: GetJobStatusUseCase,
    private readonly listPolicies: ListPoliciesUseCase,
    private readonly getPolicyDetail: GetPolicyDetailUseCase,
  ) {}

  uploadHandler = async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "validation_error", message: "file is required" });
      return;
    }

    const body = req.body as { sourceUri?: unknown };
    const sourceUri = typeof body.sourceUri === "string" ? body.sourceUri : undefined;

    const result = await this.uploadPolicy.execute(
      {
        fileName: file.originalname,
        contentType: file.mimetype,
        sizeBytes: file.size,
        sourceUri,
      },
      file.buffer,
    );
    sendResult(res, result);
  };

  getJobStatusHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.getJobStatus.execute({ jobId: req.params.jobId });
    sendResult(res, result);
  };

  listPoliciesHandler = async (_req: Request, res: Response): Promise<void> => {
    const policies = await this.listPolicies.execute();
    res.status(200).json(policies);
  };

  getPolicyDetailHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.getPolicyDetail.execute({ policyId: req.params.policyId });
    sendResult(res, result);
  };
}
