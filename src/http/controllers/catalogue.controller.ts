import type { Request, Response } from "express";

import type { ListInstrumentsUseCase } from "../../application/services/list-instruments.usecase.js";
import type { BrowseProvisionTreeUseCase } from "../../application/services/browse-provision-tree.usecase.js";
import type { GetProvisionDetailUseCase } from "../../application/services/get-provision-detail.usecase.js";
import type { SearchCatalogueUseCase } from "../../application/services/search-catalogue.usecase.js";
import type { GetFacetsUseCase } from "../../application/services/get-facets.usecase.js";
import type { ListProvisionsUseCase } from "../../application/services/list-provisions.usecase.js";
import type { SemanticSearchProvisionsUseCase } from "../../application/services/semantic-search-provisions.usecase.js";
import type { BrowseProvisionTreeDto } from "../../application/dtos/browse-provision-tree.dto.js";
import type { GetProvisionDetailDto } from "../../application/dtos/get-provision-detail.dto.js";
import type { SearchCatalogueDto } from "../../application/dtos/search-catalogue.dto.js";
import type { ListProvisionsDto } from "../../application/dtos/list-provisions.dto.js";
import type { SemanticSearchDto } from "../../application/dtos/semantic-search.dto.js";
import { sendResult } from "../result-to-response.js";

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
    res.status(200).json(instruments);
  };

  browseProvisionTreeHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as BrowseProvisionTreeDto;
    const result = await this.browseProvisionTree.execute(input);
    sendResult(res, result);
  };

  getProvisionDetailHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as GetProvisionDetailDto;
    const result = await this.getProvisionDetail.execute(input);
    sendResult(res, result);
  };

  searchCatalogueHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as SearchCatalogueDto;
    const result = await this.searchCatalogue.execute(input);
    sendResult(res, result);
  };

  getFacetsHandler = async (_req: Request, res: Response): Promise<void> => {
    const facets = await this.getFacets.execute();
    res.status(200).json(facets);
  };

  listProvisionsHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as ListProvisionsDto;
    const result = await this.listProvisions.execute(input);
    sendResult(res, result);
  };

  semanticSearchHandler = async (_req: Request, res: Response): Promise<void> => {
    const input = res.locals.validated as SemanticSearchDto;
    const result = await this.semanticSearchProvisions.execute(input);
    sendResult(res, result);
  };
}
