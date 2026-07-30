import { Router } from "express";

import type { CoverageReviewController } from "../controllers/coverage-review.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { getObligationCoverageSchema } from "../../domain/schemas/get-obligation-coverage.schema.js";
import { submitCoverageReviewSchema } from "../../domain/schemas/submit-coverage-review.schema.js";

export function coverageReviewRouter(controller: CoverageReviewController): Router {
  const router = Router();

  router.get(
    "/normative-statements/:normativeStatementId/coverage",
    validate(getObligationCoverageSchema, (req) => ({ normativeStatementId: req.params.normativeStatementId })),
    asyncHandler(controller.getObligationCoverageHandler),
  );

  router.post(
    "/coverage-edges/:edgeId/review",
    validate(submitCoverageReviewSchema, (req) => ({ ...(req.body as object), edgeId: req.params.edgeId })),
    asyncHandler(controller.submitReviewHandler),
  );

  return router;
}
