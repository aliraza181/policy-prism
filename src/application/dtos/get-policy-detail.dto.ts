import { z } from "zod";

export const getPolicyDetailSchema = z.object({
  policyId: z.string().min(1, "policyId is required"),
});

export type GetPolicyDetailDto = z.infer<typeof getPolicyDetailSchema>;
