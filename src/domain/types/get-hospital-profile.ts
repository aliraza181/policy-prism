import type { z } from "zod";
import type { getHospitalProfileSchema } from "../schemas/get-hospital-profile.schema.js";

export type GetHospitalProfileDto = z.infer<typeof getHospitalProfileSchema>;
