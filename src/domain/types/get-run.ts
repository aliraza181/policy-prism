import type { z } from "zod";
import type { getRunSchema } from "../schemas/get-run.schema.js";

export type GetRunDto = z.infer<typeof getRunSchema>;
