import type { Response } from "express";

import type { Result } from "../shared/result.ts";
import type { AppError } from "../shared/errors.ts";

const STATUS_BY_KIND: Record<string, number> = {
  not_found: 404,
  validation_error: 400,
};

export function sendResult<T>(res: Response, result: Result<T, AppError>): void {
  if (result.success) {
    res.status(200).json(result.data);
    return;
  }
  const status = STATUS_BY_KIND[result.error.kind] ?? 500;
  res.status(status).json({ error: result.error.kind, message: result.error.message });
}
