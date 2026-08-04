import { Router } from "express";

import type { CoverageReviewController } from "../controllers/coverage-review.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

export function coverageReviewRouter(controller: CoverageReviewController): Router {
  const router = Router();

  router.get(
    "/normative-statements/:normativeStatementId/coverage",
    asyncHandler(controller.getObligationCoverageHandler),
  );

  router.post("/coverage-edges/:edgeId/review", asyncHandler(controller.submitReviewHandler));

  return router;
}
