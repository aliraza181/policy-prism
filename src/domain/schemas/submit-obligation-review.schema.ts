import { z } from "zod";

export const submitObligationReviewSchema = z
  .object({
    obligationId: z.string().min(1, "obligationId is required"),
    verdict: z.enum(["confirmed", "overridden"]),
    overrideDecision: z.enum(["applies", "supports", "not_applicable", "needs_review"]).optional(),
    note: z.string().optional(),
    reviewerName: z.string().min(1, "reviewerName is required"),
  })
  .refine((data) => data.verdict !== "overridden" || data.overrideDecision !== undefined, {
    message: "overrideDecision is required when verdict is 'overridden'",
    path: ["overrideDecision"],
  });
