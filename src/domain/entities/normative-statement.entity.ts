import { DomainError } from "../errors/domain-error.js";

export interface NormativeStatementProps {
  id: string;
  statementText: string;
  modality: string;
  actorLabel: string;
  actorKind: string;
  action: string;
  object: string;
  sourceExcerpt: string;
  sourceStatementKind: string;
  provisionId: string;
}

// actorKind/sourceExcerpt/sourceStatementKind are extraction-pipeline
// provenance fields, kept internally for audit/reprocessing but never
// rendered - the public shape is what the catalogue/review UI actually uses.
export type PublicNormativeStatement = Omit<
  NormativeStatementProps,
  "actorKind" | "sourceExcerpt" | "sourceStatementKind"
>;

export class NormativeStatement {
  private constructor(private readonly props: NormativeStatementProps) {}

  static reconstitute(props: NormativeStatementProps): NormativeStatement {
    if (!props.id) {
      throw new DomainError("NormativeStatement requires an id");
    }
    return new NormativeStatement(props);
  }

  get id(): string {
    return this.props.id;
  }

  get statementText(): string {
    return this.props.statementText;
  }

  get modality(): string {
    return this.props.modality;
  }

  get actorLabel(): string {
    return this.props.actorLabel;
  }

  get provisionId(): string {
    return this.props.provisionId;
  }

  toJSON(): NormativeStatementProps {
    return { ...this.props };
  }

  toPublic(): PublicNormativeStatement {
    const { actorKind: _actorKind, sourceExcerpt: _sourceExcerpt, sourceStatementKind: _sourceStatementKind, ...publicProps } =
      this.props;
    return publicProps;
  }
}
