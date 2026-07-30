import { Router } from "express";

import type { AssessmentController } from "./assessment.controller.js";
import { asyncHandler } from "../async-handler.js";

export function assessmentRouter(controller: AssessmentController): Router {
  const router = Router();

  router.post("/assessments", asyncHandler(controller.submitRunHandler));
  router.get("/assessments/:runId", asyncHandler(controller.getRunHandler));
  router.get("/assessments/:runId/gaps", asyncHandler(controller.listGapsHandler));

  return router;
}
