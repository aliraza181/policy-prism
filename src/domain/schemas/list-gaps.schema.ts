import { z } from "zod";

export const listGapsSchema = z.object({
  runId: z.string().min(1, "runId is required"),
  gapType: z.string().min(1).optional(),
  tier1CriticalOnly: z.boolean().optional(),
});
