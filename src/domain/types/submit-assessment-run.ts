import type { z } from "zod";
import type { submitAssessmentRunSchema } from "../schemas/submit-assessment-run.schema.js";

export type SubmitAssessmentRunDto = z.infer<typeof submitAssessmentRunSchema>;
