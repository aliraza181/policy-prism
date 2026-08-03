import type { RegulatoryInstrumentRepository } from "../../domain/repositories/regulatory-instrument.repository.ts";
import type { RegulatoryInstrument } from "../../domain/entities/regulatory-instrument.entity.ts";

export class ListInstrumentsUseCase {
  constructor(private readonly instruments: RegulatoryInstrumentRepository) {}

  async execute(): Promise<RegulatoryInstrument[]> {
    return this.instruments.findAll();
  }
}
