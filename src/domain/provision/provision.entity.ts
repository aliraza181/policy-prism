import { DomainError } from "../shared/domain-error.js";

export interface ProvisionProps {
  id: string;
  instrumentRef: string;
  parentProvisionId: string | null;
  citationLabel: string;
  level: string;
  rawText: string;
  cleanText: string;
  orderIndex: number;
}

export class Provision {
  private constructor(private readonly props: ProvisionProps) {}

  static reconstitute(props: ProvisionProps): Provision {
    if (!props.id) {
      throw new DomainError("Provision requires an id");
    }
    if (!props.citationLabel) {
      throw new DomainError(`Provision ${props.id} requires a citationLabel`);
    }
    return new Provision(props);
  }

  get id(): string {
    return this.props.id;
  }

  get instrumentRef(): string {
    return this.props.instrumentRef;
  }

  get parentProvisionId(): string | null {
    return this.props.parentProvisionId;
  }

  get citationLabel(): string {
    return this.props.citationLabel;
  }

  get level(): string {
    return this.props.level;
  }

  get cleanText(): string {
    return this.props.cleanText;
  }

  get rawText(): string {
    return this.props.rawText;
  }

  get orderIndex(): number {
    return this.props.orderIndex;
  }

  toJSON(): ProvisionProps {
    return { ...this.props };
  }
}
