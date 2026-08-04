import { z } from "zod";

export const getHospitalProfileSchema = z.object({
  hospitalProfileId: z.string().min(1, "hospitalProfileId is required"),
});
