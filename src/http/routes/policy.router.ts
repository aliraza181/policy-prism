import { Router } from "express";
import multer from "multer";

import type { PolicyController } from "../controllers/policy.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

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

  router.post("/policies/upload", upload.single("file"), asyncHandler(controller.uploadHandler));

  router.post("/policies/author", asyncHandler(controller.authorHandler));

  router.get("/policies", asyncHandler(controller.listPoliciesHandler));

  router.get("/policies/:policyId", asyncHandler(controller.getPolicyDetailHandler));

  router.get("/jobs/:jobId", asyncHandler(controller.getJobStatusHandler));

  return router;
}
