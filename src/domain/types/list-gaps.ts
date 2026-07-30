import type { z } from "zod";
import type { listGapsSchema } from "../schemas/list-gaps.schema.js";

export type ListGapsDto = z.infer<typeof listGapsSchema>;
