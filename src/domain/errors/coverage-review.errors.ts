import { NotFoundError } from "../../shared/errors.js";

export class CoverageEdgeNotFoundError extends NotFoundError {
  constructor(id: string) {
    super("CoverageEdge", id);
  }
}
