import { z } from "zod";

export const submitAssessmentRunSchema = z.object({
  hospitalProfileId: z.string().min(1, "hospitalProfileId is required"),
  instrument: z.string().min(1).optional(),
  department: z.string().min(1).optional(),
  purpose: z.string().min(1).optional(),
});

export type SubmitAssessmentRunDto = z.infer<typeof submitAssessmentRunSchema>;
