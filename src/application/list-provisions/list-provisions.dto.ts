export type ProvisionListSortBy = "document" | "citation" | "level" | "department";

export interface ListProvisionsDto {
  instrumentRef?: string[] | undefined;
  level?: string | undefined;
  department?: string[] | undefined;
  includeRetired: boolean;
  sortBy: ProvisionListSortBy;
  page: number;
  pageSize: number;
}
