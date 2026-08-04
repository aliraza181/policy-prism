import { z } from "zod";

export const getObligationCoverageSchema = z.object({
  normativeStatementId: z.string().min(1, "normativeStatementId is required"),
});
