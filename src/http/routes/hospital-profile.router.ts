import { Router } from "express";

import type { HospitalProfileController } from "../controllers/hospital-profile.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

export function hospitalProfileRouter(controller: HospitalProfileController): Router {
  const router = Router();

  router.get("/hospital-profiles", asyncHandler(controller.listHospitalProfilesHandler));

  router.get("/hospital-profiles/:id", asyncHandler(controller.getHospitalProfileHandler));

  router.get("/hospital-profiles/:id/obligations", asyncHandler(controller.listObligationsHandler));

  router.post(
    "/hospital-profiles/:id/obligations/:obligationId/review",
    asyncHandler(controller.submitObligationReviewHandler),
  );

  return router;
}
