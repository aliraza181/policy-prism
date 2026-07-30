import type { Result } from "../shared/result.js";
import type { NotFoundError } from "../shared/errors.js";
import type { RegulatoryInstrument } from "./regulatory-instrument.entity.js";

export interface RegulatoryInstrumentRepository {
  findAll(): Promise<RegulatoryInstrument[]>;
  findById(id: string): Promise<Result<RegulatoryInstrument, NotFoundError>>;
}
