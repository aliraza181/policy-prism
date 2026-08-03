import type { Request, Response } from "express";

import type { ListInstrumentsUseCase } from "../../application/services/list-instruments.usecase.ts";
import type { BrowseProvisionTreeUseCase } from "../../application/services/browse-provision-tree.usecase.ts";
import type { GetProvisionDetailUseCase } from "../../application/services/get-provision-detail.usecase.ts";
import type { SearchCatalogueUseCase } from "../../application/services/search-catalogue.usecase.ts";
import type { GetFacetsUseCase } from "../../application/services/get-facets.usecase.ts";
import type { ListProvisionsUseCase } from "../../application/services/list-provisions.usecase.ts";
import type { SemanticSearchProvisionsUseCase } from "../../application/services/semantic-search-provisions.usecase.ts";
import type { BrowseProvisionTreeDto } from "../../domain/schemas/browse-provision-tree.schema.ts";
import type { GetProvisionDetailDto } from "../../domain/schemas/get-provision-detail.schema.ts";
import type { SearchCatalogueDto } from "../../domain/schemas/search-catalogue.schema.ts";
import type { ListProvisionsDto } from "../../domain/schemas/list-provisions.schema.ts";
import type { SemanticSearchDto } from "../../domain/schemas/semantic-search.schema.ts";
import { Result } from "../../shared/result.ts";
import { sendResult } from "../result-to-response.ts";

export class CatalogueController {
  constructor(
    private readonly listInstruments: ListInstrumentsUseCase,
    private readonly browseProvisionTree: BrowseProvisionTreeUseCase,
    private readonly getProvisionDetail: GetProvisionDetailUseCase,
    private readonly searchCatalogue: SearchCatalogueUseCase,
    private readonly getFacets: GetFacetsUseCase,
    private readonly listProvisions: ListProvisionsUseCase,
    private readonly semanticSearchProvisions: SemanticSearchProvisionsUseCase,
  ) {}

  listInstrumentsHandler = async (_req: Request, res: Response): Promise<void> => {
    const instruments = await this.listInstruments.execute();
    res.status(200).json(instruments.map((instrument) => instrument.toPublic()));
  };

  browseProvisionTreeHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as BrowseProvisionTreeDto;
    const input: BrowseProvisionTreeDto = {
      instrumentRef: validated.instrumentRef,
      parentProvisionId: validated.parentProvisionId,
    };
    const result = await this.browseProvisionTree.execute(input);
    sendResult(res, result.success ? Result.ok(result.data.map((provision) => provision.toPublic())) : result);
  };

  getProvisionDetailHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as GetProvisionDetailDto;
    const input: GetProvisionDetailDto = { provisionId: validated.provisionId };
    const result = await this.getProvisionDetail.execute(input);
    sendResult(
      res,
      result.success
        ? Result.ok({
            provision: result.data.provision.toPublic(),
            parentChain: result.data.parentChain.map((provision) => provision.toPublic()),
            normativeStatements: result.data.normativeStatements.map((statement) => statement.toPublic()),
            references: result.data.references,
            referencedBy: result.data.referencedBy,
          })
        : result,
    );
  };

  searchCatalogueHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as SearchCatalogueDto;
    const input: SearchCatalogueDto = {
      keyword: validated.keyword,
      instrumentRef: validated.instrumentRef,
    };
    const result = await this.searchCatalogue.execute(input);
    sendResult(res, result.success ? Result.ok(result.data.map((provision) => provision.toPublic())) : result);
  };

  getFacetsHandler = async (_req: Request, res: Response): Promise<void> => {
    const facets = await this.getFacets.execute();
    res.status(200).json(facets);
  };

  listProvisionsHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as ListProvisionsDto;
    const input: ListProvisionsDto = {
      instrumentRef: validated.instrumentRef,
      level: validated.level,
      department: validated.department,
      sortBy: validated.sortBy,
      page: validated.page,
      pageSize: validated.pageSize,
    };
    const result = await this.listProvisions.execute(input);
    sendResult(
      res,
      result.success
        ? Result.ok({ items: result.data.items.map((provision) => provision.toPublic()), total: result.data.total })
        : result,
    );
  };

  semanticSearchHandler = async (_req: Request, res: Response): Promise<void> => {
    const validated = res.locals.validatedBody as SemanticSearchDto;
    const input: SemanticSearchDto = {
      query: validated.query,
      topK: validated.topK,
      synthesize: validated.synthesize,
    };
    const result = await this.semanticSearchProvisions.execute(input);
    sendResult(res, result);
  };
}
