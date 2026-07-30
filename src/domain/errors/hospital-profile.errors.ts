import { NotFoundError } from "../../shared/errors.js";

export class HospitalProfileNotFoundError extends NotFoundError {
  constructor(id: string) {
    super("HospitalProfile", id);
  }
}
