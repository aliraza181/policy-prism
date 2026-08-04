import { DomainError } from "../errors/domain-error.ts";

export interface HospitalProfileProps {
  id: string;
  name: string;
  bedCount: number;
  sizeTier: string;
  departments: string[];
}

export type PublicHospitalProfile = HospitalProfileProps;

export class HospitalProfile {
  private constructor(private readonly props: HospitalProfileProps) {}

  static reconstitute(props: HospitalProfileProps): HospitalProfile {
    if (!props.id) {
      throw new DomainError("HospitalProfile requires an id");
    }
    if (!props.name) {
      throw new DomainError(`HospitalProfile ${props.id} requires a name`);
    }
    return new HospitalProfile(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get bedCount(): number {
    return this.props.bedCount;
  }

  get sizeTier(): string {
    return this.props.sizeTier;
  }

  get departments(): string[] {
    return this.props.departments;
  }

  toJSON(): HospitalProfileProps {
    return { ...this.props };
  }

  toPublic(): PublicHospitalProfile {
    return { ...this.props };
  }
}
