import type { RegulatoryInstrumentRepository } from "../../domain/regulatory-instrument/regulatory-instrument.repository.js";
import type { RegulatoryInstrument } from "../../domain/regulatory-instrument/regulatory-instrument.entity.js";

export class ListInstrumentsUseCase {
  constructor(private readonly instruments: RegulatoryInstrumentRepository) {}

  async execute(): Promise<RegulatoryInstrument[]> {
    return this.instruments.findAll();
  }
}
