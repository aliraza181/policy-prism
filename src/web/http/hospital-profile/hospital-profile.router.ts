import { Router } from "express";

import type { HospitalProfileController } from "./hospital-profile.controller.js";
import { asyncHandler } from "../async-handler.js";

export function hospitalProfileRouter(controller: HospitalProfileController): Router {
  const router = Router();
  router.get("/hospital-profiles/:id", asyncHandler(controller.getHospitalProfileHandler));
  return router;
}
