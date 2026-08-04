import type { Result } from "../../../shared/result.ts";
import type { NotFoundError } from "../../../shared/errors.ts";
import type { RegulatoryInstrument } from "../../../domain/entities/regulatory-instrument.entity.ts";

export interface IRegulatoryInstrumentRepository {
  findAll(): Promise<RegulatoryInstrument[]>;
  findById(id: string): Promise<Result<RegulatoryInstrument, NotFoundError>>;
}
