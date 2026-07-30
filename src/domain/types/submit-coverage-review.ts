import type { z } from "zod";
import type { submitCoverageReviewSchema } from "../schemas/submit-coverage-review.schema.js";

export type SubmitCoverageReviewDto = z.infer<typeof submitCoverageReviewSchema>;
