import { z } from "zod";

export const getRunSchema = z.object({
  runId: z.string().min(1, "runId is required"),
});

export type GetRunDto = z.infer<typeof getRunSchema>;
