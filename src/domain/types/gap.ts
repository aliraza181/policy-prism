export interface Gap {
  id: string;
  obligationId: string;
  obligationTitle: string | null;
  normativeStatementId: string;
  normativeStatementText: string;
  citationLabel: string;
  provisionId: string | null;
  gapType: string;
  missingComponents: Array<Record<string, unknown>>;
  surveyRisk: string;
  patientSafetyRisk: string;
  governanceUrgency: string;
  riskTierFloor: number | null;
  tier1Critical: boolean;
  ownerRole: string;
  ownerReroutesToOnAssessment: string | null;
  rationale: string;
  coveringPolicyId: string | null;
  coveringPolicyTitle: string | null;
  coveringSectionId: string | null;
  coveringSectionRef: string | null;
}
