import type { z } from "zod";
import type { getObligationCoverageSchema } from "../schemas/get-obligation-coverage.schema.js";

export type GetObligationCoverageDto = z.infer<typeof getObligationCoverageSchema>;
