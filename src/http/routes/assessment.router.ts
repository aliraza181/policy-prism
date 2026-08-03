import { Router } from "express";

import type { AssessmentController } from "../controllers/assessment.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";
import { validate } from "../middleware/validate.ts";
import { submitAssessmentRunSchema } from "../../domain/schemas/submit-assessment-run.schema.ts";
import { getRunSchema } from "../../domain/schemas/get-run.schema.ts";
import { listGapsSchema } from "../../domain/schemas/list-gaps.schema.ts";

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
