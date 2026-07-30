/**
 * The obligation-and-source-provision facts the review page's ContextStrip
 * and Supporting Context rail need - constant across every mapping shown
 * for one normative statement, so returned once rather than duplicated on
 * each ObligationCoverageMapping row.
 */
export interface ObligationContext {
  normativeStatementId: string;
  normativeStatementText: string;
  modality: string;
  actorLabel: string;
  action: string;
  object: string;
  provisionId: string;
  citationLabel: string;
  instrumentRef: string;
  provisionText: string;
  /** Count of NormativeStatements extracted from the same source provision. */
  statementCount: number;
}
