import { DomainError } from "../errors/domain-error.ts";

export interface PolicyProps {
  id: string;
  title: string;
  formatType: string;
  sourceUri: string;
  hospitalProfileId: string | null;
  department: string | null;
  owner: string | null;
  policyNumber: string | null;
  effectiveDate: string | null;
  nextReviewDate: string | null;
  nativeMetadata: Record<string, unknown>;
  approvals: Array<Record<string, unknown>>;
  revisionHistory: Array<Record<string, unknown>>;
  crossReferences: Array<Record<string, unknown>>;
}

export type PublicPolicy = PolicyProps;

export class Policy {
  private constructor(private readonly props: PolicyProps) {}

  static reconstitute(props: PolicyProps): Policy {
    if (!props.id) {
      throw new DomainError("Policy requires an id");
    }
    if (!props.title) {
      throw new DomainError(`Policy ${props.id} requires a title`);
    }
    if (!props.sourceUri) {
      throw new DomainError(`Policy ${props.id} requires a sourceUri`);
    }
    return new Policy(props);
  }

  get id(): string {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get formatType(): string {
    return this.props.formatType;
  }

  get sourceUri(): string {
    return this.props.sourceUri;
  }

  get hospitalProfileId(): string | null {
    return this.props.hospitalProfileId;
  }

  get department(): string | null {
    return this.props.department;
  }

  get owner(): string | null {
    return this.props.owner;
  }

  get policyNumber(): string | null {
    return this.props.policyNumber;
  }

  get effectiveDate(): string | null {
    return this.props.effectiveDate;
  }

  get nextReviewDate(): string | null {
    return this.props.nextReviewDate;
  }

  get nativeMetadata(): Record<string, unknown> {
    return this.props.nativeMetadata;
  }

  get approvals(): Array<Record<string, unknown>> {
    return this.props.approvals;
  }

  get revisionHistory(): Array<Record<string, unknown>> {
    return this.props.revisionHistory;
  }

  get crossReferences(): Array<Record<string, unknown>> {
    return this.props.crossReferences;
  }

  toJSON(): PolicyProps {
    return { ...this.props };
  }

  toPublic(): PublicPolicy {
    return { ...this.props };
  }
}
