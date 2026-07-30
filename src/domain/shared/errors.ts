export abstract class AppError {
  abstract readonly kind: string;
  constructor(readonly message: string) {}
}

export class NotFoundError extends AppError {
  readonly kind = "not_found";
  constructor(
    readonly resource: string,
    readonly id: string,
  ) {
    super(`${resource} not found: ${id}`);
  }
}
