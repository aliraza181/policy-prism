export interface AuthorPolicyDto {
  title: string;
  bodyText: string;
  department?: string | undefined;
  owner?: string | undefined;
  policyNumber?: string | undefined;
  effectiveDate?: string | undefined;
  nextReviewDate?: string | undefined;
  keywords?: string[] | undefined;
  revisionType?: string | undefined;
  hospitalProfileId?: string | undefined;
}
