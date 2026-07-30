import { z } from "zod";

export const getHospitalProfileSchema = z.object({
  id: z.string().min(1, "id is required"),
});

export type GetHospitalProfileDto = z.infer<typeof getHospitalProfileSchema>;
