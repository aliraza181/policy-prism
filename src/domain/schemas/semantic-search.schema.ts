import { z } from "zod";

export const semanticSearchSchema = z.object({
  query: z.string().min(1, "query is required"),
  topK: z.coerce.number().int().min(1).max(50).default(10),
  // z.coerce.boolean() would treat the string "false" as truthy, since any
  // non-empty string is truthy in JS - this maps the two valid query-string
  // values explicitly instead.
  synthesize: z
    .union([z.literal("true"), z.literal("false")])
    .default("true")
    .transform((value) => value === "true"),
});
