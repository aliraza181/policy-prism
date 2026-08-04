import type { ZodType, ZodTypeDef } from "zod";

import { ValidationError } from "../shared/errors.ts";

/**
 * Parses candidate input against a Zod schema, throwing ValidationError
 * (caught by the app's error-handling middleware and turned into a 400) on
 * failure. Called directly by controllers - not route middleware - so a
 * controller handler owns both "what input does this endpoint need" and
 * "is it valid", instead of splitting that across a router and a handler.
 */
export function parseOrThrow<T>(schema: ZodType<T, ZodTypeDef, unknown>, input: unknown): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    throw new ValidationError(issues);
  }
  return parsed.data;
}
