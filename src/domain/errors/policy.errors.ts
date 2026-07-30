import { NotFoundError } from "../../shared/errors.js";

export class PolicyNotFoundError extends NotFoundError {
  constructor(id: string) {
    super("Policy", id);
  }
}

export class PolicyIntakeJobNotFoundError extends NotFoundError {
  constructor(id: string) {
    super("PolicyIntakeJob", id);
  }
}
