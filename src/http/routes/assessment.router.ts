import { Router } from "express";

import type { AssessmentController } from "../controllers/assessment.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

export function assessmentRouter(controller: AssessmentController): Router {
  const router = Router();

  router.post("/assessments", asyncHandler(controller.submitRunHandler));

  router.get("/assessments", asyncHandler(controller.listRunsHandler));

  router.get("/assessments/:runId", asyncHandler(controller.getRunHandler));

  router.get("/assessments/:runId/gaps", asyncHandler(controller.listGapsHandler));

  return router;
}
