import type { z } from "zod";
import type { uploadPolicySchema } from "../schemas/upload-policy.schema.js";

export type UploadPolicyDto = z.infer<typeof uploadPolicySchema>;
