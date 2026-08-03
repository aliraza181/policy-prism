import type { ProvisionRepository } from "../../domain/repositories/provision.repository.ts";

export interface CatalogueFacets {
  byInstrument: Array<{ instrumentRef: string; count: number }>;
  byLevel: Array<{ level: string; count: number }>;
  byDepartment: Array<{ department: string; count: number }>;
}

/**
 * Provision.categoryGroup / regulatoryCategory (ubiquitous-language.md §5.2)
 * are not populated yet — that's Phase 4 classification, which hasn't run.
 * byDepartment is a separate, already-populated classification (see
 * pipeline/prism/classification) covering hospital-department relevance,
 * not the ubiquitous-language regulatory taxonomy.
 */
export class GetFacetsUseCase {
  constructor(private readonly provisions: ProvisionRepository) {}

  async execute(): Promise<CatalogueFacets> {
    const [byInstrument, byLevel, byDepartment] = await Promise.all([
      this.provisions.countByInstrument(),
      this.provisions.countByLevel(),
      this.provisions.countByDepartment(),
    ]);
    return { byInstrument, byLevel, byDepartment };
  }
}
