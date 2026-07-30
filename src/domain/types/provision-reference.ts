/**
 * A citation from one provision's normative statement to another provision,
 * derived from the NS_REFERENCE edge: (:NormativeStatement)-[:NS_REFERENCE]->(:Provision).
 * provisionId/citationLabel is the "other side" - the target provision for an
 * outgoing reference, or the source provision for an incoming referencedBy.
 */
export interface ProvisionReference {
  id: string;
  normativeStatementId: string;
  normativeStatementText: string;
  relation: string;
  evidence: string;
  confidence: number;
  rawRef: string;
  provisionId: string;
  citationLabel: string;
}
