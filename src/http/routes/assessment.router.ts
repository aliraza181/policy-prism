import { Router } from "express";

import type { AssessmentController } from "../controllers/assessment.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { submitAssessmentRunSchema } from "../../domain/schemas/submit-assessment-run.schema.js";
import { getRunSchema } from "../../domain/schemas/get-run.schema.js";
import { listGapsSchema } from "../../domain/schemas/list-gaps.schema.js";

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
