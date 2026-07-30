import type { z } from "zod";
import type { getPolicyDetailSchema } from "../schemas/get-policy-detail.schema.js";

export type GetPolicyDetailDto = z.infer<typeof getPolicyDetailSchema>;
