import { Router } from "express";

import type { HospitalProfileController } from "../controllers/hospital-profile.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { getHospitalProfileSchema } from "../../domain/schemas/get-hospital-profile.schema.js";

export function hospitalProfileRouter(controller: HospitalProfileController): Router {
  const router = Router();
  router.get(
    "/hospital-profiles/:id",
    validate(getHospitalProfileSchema, (req) => ({ id: req.params.id })),
    asyncHandler(controller.getHospitalProfileHandler),
  );
  return router;
}
