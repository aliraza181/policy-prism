import { NotFoundError } from "../shared/errors.js";

export class ProvisionNotFoundError extends NotFoundError {
  constructor(id: string) {
    super("Provision", id);
  }
}
