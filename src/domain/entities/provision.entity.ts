import { DomainError } from "../errors/domain-error.js";

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

// rawText is the pre-cleanup pipeline artifact (header/footer noise, OCR
// quirks) kept internally for reprocessing - only cleanText is fit to show.
export type PublicProvision = Omit<ProvisionProps, "rawText">;

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

  toPublic(): PublicProvision {
    const { rawText: _rawText, ...publicProps } = this.props;
    return publicProps;
  }
}
