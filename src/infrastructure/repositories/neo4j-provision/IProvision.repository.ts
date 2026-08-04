import type { Result } from "../../../shared/result.ts";
import type { Provision } from "../../../domain/entities/provision.entity.ts";
import type { ProvisionNotFoundError } from "../../../shared/errors.ts";
import type { ProvisionReference } from "../../../domain/types/provision-reference.ts";

export interface CatalogueSearchQuery {
  keyword: string;
  instrumentRef?: string | undefined;
}

export type ProvisionListSort = "document" | "citation" | "level" | "department";

export interface ProvisionListQuery {
  /** Multi-select: matches provisions in ANY of these instruments. */
  instrumentRef?: string[] | undefined;
  level?: string | undefined;
  /** Multi-select: matches provisions tagged with ANY of these departments. */
  department?: string[] | undefined;
  /** Audit access only - normal browsing always excludes retired provisions. */
  includeRetired?: boolean | undefined;
  sortBy: ProvisionListSort;
  page: number;
  pageSize: number;
}

export interface ProvisionListResult {
  items: Provision[];
  total: number;
}

export interface IProvisionRepository {
  findById(id: string): Promise<Result<Provision, ProvisionNotFoundError>>;
  findTopLevelSections(instrumentRef: string): Promise<Provision[]>;
  findChildren(parentProvisionId: string): Promise<Provision[]>;
  findParentChain(provisionId: string): Promise<Provision[]>;
  /** Outgoing: this provision's own normative statements citing other provisions. */
  findReferences(provisionId: string): Promise<ProvisionReference[]>;
  /** Incoming: other provisions' normative statements citing this one. */
  findReferencedBy(provisionId: string): Promise<ProvisionReference[]>;
  search(query: CatalogueSearchQuery): Promise<Provision[]>;
  listAll(query: ProvisionListQuery): Promise<ProvisionListResult>;
  countByInstrument(): Promise<Array<{ instrumentRef: string; count: number }>>;
  countByLevel(): Promise<Array<{ level: string; count: number }>>;
  countByDepartment(): Promise<Array<{ department: string; count: number }>>;
}
