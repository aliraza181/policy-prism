import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType, ZodTypeDef } from "zod";

import { ValidationError } from "../../shared/errors.ts";

/**
 * Runs Zod validation before the controller is ever invoked, so a
 * controller/use-case downstream never sees raw, unvalidated req data -
 * res.locals.validatedBody carries the parsed, typed result. Notification
 * pattern: every issue is collected, not just the first.
 *
 * `buildInput` lets a route assemble its candidate input from whatever mix
 * of params/query/body the endpoint actually needs (most REST routes here
 * validate path params, not just the body) - defaults to req.body for the
 * common POST-a-JSON-object case.
 */
export function validate<T>(
  schema: ZodType<T, ZodTypeDef, unknown>,
  buildInput: (req: Request) => unknown = (req) => req.body,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(buildInput(req));
    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      const error = new ValidationError(issues);
      res.status(400).json({ error: error.kind, message: error.message });
      return;
    }
    res.locals.validatedBody = parsed.data;
    next();
  };
}
