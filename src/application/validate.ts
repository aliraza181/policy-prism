import type { ZodType, ZodTypeDef } from "zod";

import { Result } from "../shared/result.js";
import { ValidationError } from "../shared/errors.js";

/**
 * Notification pattern: collects every validation issue, not just the
 * first, so a caller can fix all problems in one round trip.
 *
 * `Input` is inferred independently of `T` so schemas with `.default()`
 * (where the parsed input type differs from the output type `T`) still
 * unify correctly instead of forcing `T` to absorb the input's optionality.
 */
export function validate<T, Input = unknown>(
  schema: ZodType<T, ZodTypeDef, Input>,
  input: unknown,
): Result<T, ValidationError> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    return Result.err(new ValidationError(issues));
  }
  return Result.ok(parsed.data);
}
