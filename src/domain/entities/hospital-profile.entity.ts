import { DomainError } from "../errors/domain-error.js";

export type ProfileFactStatus = "present" | "absent" | "unknown" | "not_applicable";
export type ProfileFactPosture = "authored" | "verified" | "inferred_signal";
export type ProfileFactConfidence = "confirmed" | "inferred" | "disputed" | "unknown";

export interface ProfileFact {
  key: string;
  status: ProfileFactStatus;
  facilityId: string | null;
  value: string | null;
  posture: ProfileFactPosture;
  confidence: ProfileFactConfidence;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  evidenceRefs: string[];
  notes: string | null;
}

export interface Facility {
  facilityId: string;
  facilityName: string;
  facilityType: string;
  licenseClass: string;
}

export interface HospitalProfileIdentity {
  legalEntityName: string;
  displayName: string;
  jurisdiction: string;
  state: string;
}

export interface HospitalProfileProps {
  id: string;
  identity: HospitalProfileIdentity;
  facilities: Facility[];
  participationAndLicensure: ProfileFact[];
  servicesAndCapabilities: ProfileFact[];
  unitsAndCareSettings: ProfileFact[];
  patientPopulationsAndServiceArea: ProfileFact[];
  sourceScopeOverrides: unknown[];
}

export class HospitalProfile {
  private constructor(private readonly props: HospitalProfileProps) {}

  static reconstitute(props: HospitalProfileProps): HospitalProfile {
    if (!props.id) {
      throw new DomainError("HospitalProfile requires an id");
    }
    if (!props.identity.legalEntityName) {
      throw new DomainError(`HospitalProfile ${props.id} requires identity.legalEntityName`);
    }
    return new HospitalProfile(props);
  }

  get id(): string {
    return this.props.id;
  }

  get identity(): HospitalProfileIdentity {
    return this.props.identity;
  }

  get facilities(): Facility[] {
    return this.props.facilities;
  }

  get participationAndLicensure(): ProfileFact[] {
    return this.props.participationAndLicensure;
  }

  get servicesAndCapabilities(): ProfileFact[] {
    return this.props.servicesAndCapabilities;
  }

  get unitsAndCareSettings(): ProfileFact[] {
    return this.props.unitsAndCareSettings;
  }

  get patientPopulationsAndServiceArea(): ProfileFact[] {
    return this.props.patientPopulationsAndServiceArea;
  }

  get sourceScopeOverrides(): unknown[] {
    return this.props.sourceScopeOverrides;
  }

  toJSON(): HospitalProfileProps {
    return { ...this.props };
  }
}
