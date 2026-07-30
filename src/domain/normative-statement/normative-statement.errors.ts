import { NotFoundError } from "../shared/errors.js";

export class NormativeStatementNotFoundError extends NotFoundError {
  constructor(id: string) {
    super("NormativeStatement", id);
  }
}
