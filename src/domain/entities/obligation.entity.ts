import { DomainError } from "../errors/domain-error.ts";

export interface ObligationProps {
  id: string;
  hospitalProfileId: string;
  title: string;
  // decision is the CURRENT decision (may be human-overridden); aiDecision is
  // immutable, set once at generation - keeping both preserves an audit
  // trail of what the AI originally said vs. what a human decided.
  decision: string;
  aiDecision: string;
  reasoning: string;
  sourceNormativeStatementId: string;
  sourceProvisionId: string;
  status: string;
  reviewStatus: string;
  reviewNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
}

export type PublicObligation = ObligationProps;

export class Obligation {
  private constructor(private readonly props: ObligationProps) {}

  static reconstitute(props: ObligationProps): Obligation {
    if (!props.id) {
      throw new DomainError("Obligation requires an id");
    }
    if (!props.hospitalProfileId) {
      throw new DomainError(`Obligation ${props.id} requires a hospitalProfileId`);
    }
    return new Obligation(props);
  }

  get id(): string {
    return this.props.id;
  }

  get hospitalProfileId(): string {
    return this.props.hospitalProfileId;
  }

  get title(): string {
    return this.props.title;
  }

  get decision(): string {
    return this.props.decision;
  }

  get aiDecision(): string {
    return this.props.aiDecision;
  }

  get reasoning(): string {
    return this.props.reasoning;
  }

  get sourceNormativeStatementId(): string {
    return this.props.sourceNormativeStatementId;
  }

  get sourceProvisionId(): string {
    return this.props.sourceProvisionId;
  }

  get status(): string {
    return this.props.status;
  }

  get reviewStatus(): string {
    return this.props.reviewStatus;
  }

  get reviewNote(): string | null {
    return this.props.reviewNote;
  }

  get reviewedBy(): string | null {
    return this.props.reviewedBy;
  }

  get reviewedAt(): string | null {
    return this.props.reviewedAt;
  }

  toJSON(): ObligationProps {
    return { ...this.props };
  }

  toPublic(): PublicObligation {
    return { ...this.props };
  }
}
