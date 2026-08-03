import { DomainError } from "../errors/domain-error.ts";

export interface RegulatoryInstrumentProps {
  id: string;
  kind: string;
  jurisdiction: string;
}

export type PublicRegulatoryInstrument = RegulatoryInstrumentProps;

export class RegulatoryInstrument {
  private constructor(private readonly props: RegulatoryInstrumentProps) {}

  static reconstitute(props: RegulatoryInstrumentProps): RegulatoryInstrument {
    if (!props.id) {
      throw new DomainError("RegulatoryInstrument requires an id");
    }
    return new RegulatoryInstrument(props);
  }

  get id(): string {
    return this.props.id;
  }

  get kind(): string {
    return this.props.kind;
  }

  get jurisdiction(): string {
    return this.props.jurisdiction;
  }

  toJSON(): RegulatoryInstrumentProps {
    return { ...this.props };
  }

  toPublic(): PublicRegulatoryInstrument {
    return { ...this.props };
  }
}
