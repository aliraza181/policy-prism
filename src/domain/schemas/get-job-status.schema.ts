import { z } from "zod";

export const getJobStatusSchema = z.object({
  jobId: z.string().min(1, "jobId is required"),
});

export type GetJobStatusDto = z.infer<typeof getJobStatusSchema>;
