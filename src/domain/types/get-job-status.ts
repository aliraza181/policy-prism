import type { z } from "zod";
import type { getJobStatusSchema } from "../schemas/get-job-status.schema.js";

export type GetJobStatusDto = z.infer<typeof getJobStatusSchema>;
