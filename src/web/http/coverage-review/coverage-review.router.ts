import { Router } from "express";

import type { CoverageReviewController } from "./coverage-review.controller.js";
import { asyncHandler } from "../async-handler.js";

export function coverageReviewRouter(controller: CoverageReviewController): Router {
  const router = Router();

  router.get(
    "/normative-statements/:normativeStatementId/coverage",
    asyncHandler(controller.getObligationCoverageHandler),
  );
  router.post("/coverage-edges/:edgeId/review", asyncHandler(controller.submitReviewHandler));

  return router;
}
