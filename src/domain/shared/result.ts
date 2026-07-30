export type Result<T, E> = Ok<T> | Err<E>;

export class Ok<T> {
  readonly isOk = true;
  readonly isErr = false;

  constructor(readonly value: T) {}

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Ok(fn(this.value));
  }

  andThen<U, E2>(fn: (value: T) => Result<U, E2>): Result<U, E2> {
    return fn(this.value);
  }

  match<U>(handlers: { ok: (value: T) => U; err: (error: never) => U }): U {
    return handlers.ok(this.value);
  }
}

export class Err<E> {
  readonly isOk = false;
  readonly isErr = true;

  constructor(readonly error: E) {}

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return new Err(this.error);
  }

  andThen<U, E2>(_fn: (value: never) => Result<U, E2>): Result<U, E | E2> {
    return new Err(this.error);
  }

  match<U>(handlers: { ok: (value: never) => U; err: (error: E) => U }): U {
    return handlers.err(this.error);
  }
}

export const Result = {
  ok<T>(value: T): Result<T, never> {
    return new Ok(value);
  },
  err<E>(error: E): Result<never, E> {
    return new Err(error);
  },
};
