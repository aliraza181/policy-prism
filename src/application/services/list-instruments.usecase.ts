import type { RegulatoryInstrumentRepository } from "../../domain/repositories/regulatory-instrument.repository.js";
import type { RegulatoryInstrument } from "../../domain/entities/regulatory-instrument.entity.js";

export class ListInstrumentsUseCase {
  constructor(private readonly instruments: RegulatoryInstrumentRepository) {}

  async execute(): Promise<RegulatoryInstrument[]> {
    return this.instruments.findAll();
  }
}
