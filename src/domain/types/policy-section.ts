export interface PolicySection {
  id: string;
  policyId: string;
  sectionRef: string;
  level: string;
  parentId: string | null;
  rawText: string;
  cleanText: string;
  orderIndex: number;
}
