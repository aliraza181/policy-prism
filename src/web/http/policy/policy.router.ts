import { Router } from "express";
import multer from "multer";

import type { PolicyController } from "./policy.controller.js";
import { asyncHandler } from "../async-handler.js";

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
  router.get("/policies", asyncHandler(controller.listPoliciesHandler));
  router.get("/policies/:policyId", asyncHandler(controller.getPolicyDetailHandler));
  router.get("/jobs/:jobId", asyncHandler(controller.getJobStatusHandler));

  return router;
}
