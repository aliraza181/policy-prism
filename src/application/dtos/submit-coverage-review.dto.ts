import { z } from "zod";

const REASON_CATEGORIES = ["missing_element", "contradicts_obligation", "outdated_policy_text"] as const;

const baseSchema = z.object({
  edgeId: z.string().min(1, "edgeId is required"),
  verdict: z.enum(["confirmed", "flagged_mismatch", "flagged_ambiguous"]),
  reasonCategory: z.enum(REASON_CATEGORIES).optional(),
  note: z.string().min(1).optional(),
  reviewerName: z.string().min(1, "reviewerName is required"),
});

// A flagged mismatch must name why (one of the 3 seeded reasons) - the
// wireframe's mismatch screen shows only the reason chips, no free-text
// note field. An ambiguous flag has no reason taxonomy (it's inherently
// "the two texts alone can't settle this"), so it requires a note
// explaining why instead - "Confirm" is the only verdict needing neither.
export const submitCoverageReviewSchema = baseSchema.superRefine((value, ctx) => {
  if (value.verdict === "flagged_mismatch" && !value.reasonCategory) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["reasonCategory"],
      message: "reasonCategory is required when verdict is flagged_mismatch",
    });
  }
  if (value.verdict === "flagged_ambiguous" && !value.note) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["note"],
      message: "note is required when verdict is flagged_ambiguous",
    });
  }
});

export type SubmitCoverageReviewDto = z.infer<typeof submitCoverageReviewSchema>;
