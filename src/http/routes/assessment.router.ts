import { Router } from "express";

import type { AssessmentController } from "../controllers/assessment.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { submitAssessmentRunSchema } from "../../application/dtos/submit-assessment-run.dto.js";
import { getRunSchema } from "../../application/dtos/get-run.dto.js";
import { listGapsSchema } from "../../application/dtos/list-gaps.dto.js";

export function assessmentRouter(controller: AssessmentController): Router {
  const router = Router();

  router.post("/assessments", validate(submitAssessmentRunSchema), asyncHandler(controller.submitRunHandler));

  router.get(
    "/assessments/:runId",
    validate(getRunSchema, (req) => ({ runId: req.params.runId })),
    asyncHandler(controller.getRunHandler),
  );

  router.get(
    "/assessments/:runId/gaps",
    validate(listGapsSchema, (req) => ({
      runId: req.params.runId,
      gapType: req.query.gapType,
      tier1CriticalOnly: req.query.tier1CriticalOnly === "true" ? true : undefined,
    })),
    asyncHandler(controller.listGapsHandler),
  );

  return router;
}
