import { z } from "zod";

// Express parses a repeated query key (?department=a&department=b) as an array,
// but a single occurrence as a plain string - this normalizes both to an array
// (or undefined if the key was never sent) so the rest of the app only ever
// deals with one shape.
const multiValue = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) => (value === undefined ? undefined : Array.isArray(value) ? value : [value]));

export const listProvisionsSchema = z.object({
  instrumentRef: multiValue,
  level: z.string().min(1).optional(),
  department: multiValue,
  sortBy: z.enum(["document", "citation", "level"]).default("document"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListProvisionsDto = z.infer<typeof listProvisionsSchema>;
