import { z } from "zod";

export const getProvisionDetailSchema = z.object({
  provisionId: z.string().min(1, "provisionId is required"),
});
