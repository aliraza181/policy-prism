import type { IRegulatoryInstrumentRepository } from "../../infrastructure/repositories/neo4j-regulatory-instrument/IRegulatoryInstrument.repository.ts";
import type { RegulatoryInstrument } from "../../domain/entities/regulatory-instrument.entity.ts";

export class ListInstrumentsUseCase {
  constructor(private readonly instruments: IRegulatoryInstrumentRepository) {}

  async execute(): Promise<RegulatoryInstrument[]> {
    return this.instruments.findAll();
  }
}
