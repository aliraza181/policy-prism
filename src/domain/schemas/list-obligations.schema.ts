import { z } from "zod";

export const listObligationsSchema = z.object({
  hospitalProfileId: z.string().min(1, "hospitalProfileId is required"),
  decision: z.enum(["applies", "supports", "not_applicable", "needs_review"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
