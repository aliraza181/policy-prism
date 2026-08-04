export type PolicyUploadContentType =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export interface UploadPolicyDto {
  fileName: string;
  contentType: PolicyUploadContentType;
  sizeBytes: number;
  sourceUri?: string | undefined;
  hospitalProfileId?: string | undefined;
}
