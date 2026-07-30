import type { Request, Response } from "express";

import type { ListInstrumentsUseCase } from "../../../app/catalogue/list-instruments.usecase.js";
import type { BrowseProvisionTreeUseCase } from "../../../app/catalogue/browse-provision-tree.usecase.js";
import type { GetProvisionDetailUseCase } from "../../../app/catalogue/get-provision-detail.usecase.js";
import type { SearchCatalogueUseCase } from "../../../app/catalogue/search-catalogue.usecase.js";
import type { GetFacetsUseCase } from "../../../app/catalogue/get-facets.usecase.js";
import type { ListProvisionsUseCase } from "../../../app/catalogue/list-provisions.usecase.js";
import type { SemanticSearchProvisionsUseCase } from "../../../app/catalogue/semantic-search-provisions.usecase.js";
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

  browseProvisionTreeHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.browseProvisionTree.execute({
      instrumentRef: req.params.instrumentRef,
      parentProvisionId: req.query.parentId,
    });
    sendResult(res, result);
  };

  getProvisionDetailHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.getProvisionDetail.execute({ provisionId: req.params.provisionId });
    sendResult(res, result);
  };

  searchCatalogueHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.searchCatalogue.execute({
      keyword: req.query.keyword,
      instrumentRef: req.query.instrumentRef,
    });
    sendResult(res, result);
  };

  getFacetsHandler = async (_req: Request, res: Response): Promise<void> => {
    const facets = await this.getFacets.execute();
    res.status(200).json(facets);
  };

  listProvisionsHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.listProvisions.execute(req.query);
    sendResult(res, result);
  };

  semanticSearchHandler = async (req: Request, res: Response): Promise<void> => {
    const result = await this.semanticSearchProvisions.execute(req.query);
    sendResult(res, result);
  };
}
