import { z } from "zod";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const uploadPolicySchema = z.object({
  fileName: z.string().min(1),
  contentType: z.enum([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]),
  sizeBytes: z.number().int().positive().max(MAX_UPLOAD_BYTES),
  sourceUri: z.string().min(1).optional(),
  hospitalProfileId: z.string().min(1).optional(),
});
