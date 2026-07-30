export interface Gap {
  id: string;
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
}
