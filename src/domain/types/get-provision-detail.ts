import type { z } from "zod";
import type { getProvisionDetailSchema } from "../schemas/get-provision-detail.schema.js";

export type GetProvisionDetailDto = z.infer<typeof getProvisionDetailSchema>;
