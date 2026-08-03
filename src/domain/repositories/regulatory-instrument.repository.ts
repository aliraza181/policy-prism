import type { Result } from "../../shared/result.ts";
import type { NotFoundError } from "../../shared/errors.ts";
import type { RegulatoryInstrument } from "../entities/regulatory-instrument.entity.ts";

export interface RegulatoryInstrumentRepository {
  findAll(): Promise<RegulatoryInstrument[]>;
  findById(id: string): Promise<Result<RegulatoryInstrument, NotFoundError>>;
}
