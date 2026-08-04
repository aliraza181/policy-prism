import { z } from "zod";

export const browseProvisionTreeSchema = z.object({
  instrumentRef: z.string().min(1, "instrumentRef is required"),
  parentProvisionId: z.string().min(1).optional(),
});
