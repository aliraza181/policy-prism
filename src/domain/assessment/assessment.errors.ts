import { NotFoundError } from "../shared/errors.js";

export class AssessmentRunNotFoundError extends NotFoundError {
  constructor(id: string) {
    super("AssessmentRun", id);
  }
}
