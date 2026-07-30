import type { z } from "zod";
import type { listProvisionsSchema } from "../schemas/list-provisions.schema.js";

export type ListProvisionsDto = z.infer<typeof listProvisionsSchema>;
