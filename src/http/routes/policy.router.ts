import { Router } from "express";
import multer from "multer";

import type { PolicyController } from "../controllers/policy.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { uploadPolicySchema } from "../../application/dtos/upload-policy.dto.js";
import { getJobStatusSchema } from "../../application/dtos/get-job-status.dto.js";
import { getPolicyDetailSchema } from "../../application/dtos/get-policy-detail.dto.js";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter: (_req, file, callback) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    callback(null, allowed.includes(file.mimetype));
  },
});

export function policyRouter(controller: PolicyController): Router {
  const router = Router();

  router.post(
    "/policies/upload",
    upload.single("file"),
    // multer runs first, so req.file is already populated by the time this
    // builds the candidate input - a missing file fails validation here
    // (fileName required) rather than needing a separate manual check.
    validate(uploadPolicySchema, (req) => {
      const file = req.file;
      const body = req.body as { sourceUri?: unknown };
      return {
        fileName: file?.originalname,
        contentType: file?.mimetype,
        sizeBytes: file?.size,
        sourceUri: typeof body.sourceUri === "string" ? body.sourceUri : undefined,
      };
    }),
    asyncHandler(controller.uploadHandler),
  );

  router.get("/policies", asyncHandler(controller.listPoliciesHandler));

  router.get(
    "/policies/:policyId",
    validate(getPolicyDetailSchema, (req) => ({ policyId: req.params.policyId })),
    asyncHandler(controller.getPolicyDetailHandler),
  );

  router.get(
    "/jobs/:jobId",
    validate(getJobStatusSchema, (req) => ({ jobId: req.params.jobId })),
    asyncHandler(controller.getJobStatusHandler),
  );

  return router;
}
