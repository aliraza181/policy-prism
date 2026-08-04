import type { Request, Response } from "express";

import type { ListInstrumentsUseCase } from "../../application/list-instruments/list-instruments.usecase.ts";
import type { BrowseProvisionTreeUseCase } from "../../application/browse-provision-tree/browse-provision-tree.usecase.ts";
import type { GetProvisionDetailUseCase } from "../../application/get-provision-detail/get-provision-detail.usecase.ts";
import type { SearchCatalogueUseCase } from "../../application/search-catalogue/search-catalogue.usecase.ts";
import type { GetFacetsUseCase } from "../../application/get-facets/get-facets.usecase.ts";
import type { ListProvisionsUseCase } from "../../application/list-provisions/list-provisions.usecase.ts";
import type { SemanticSearchProvisionsUseCase } from "../../application/semantic-search-provisions/semantic-search-provisions.usecase.ts";
import type { BrowseProvisionTreeDto } from "../../application/browse-provision-tree/browse-provision-tree.dto.ts";
import type { GetProvisionDetailDto } from "../../application/get-provision-detail/get-provision-detail.dto.ts";
import type { SearchCatalogueDto } from "../../application/search-catalogue/search-catalogue.dto.ts";
import type { ListProvisionsDto } from "../../application/list-provisions/list-provisions.dto.ts";
import type { SemanticSearchDto } from "../../application/semantic-search-provisions/semantic-search.dto.ts";
import { browseProvisionTreeSchema } from "../../domain/schemas/browse-provision-tree.schema.ts";
import { getProvisionDetailSchema } from "../../domain/schemas/get-provision-detail.schema.ts";
import { searchCatalogueSchema } from "../../domain/schemas/search-catalogue.schema.ts";
import { listProvisionsSchema } from "../../domain/schemas/list-provisions.schema.ts";
import { semanticSearchSchema } from "../../domain/schemas/semantic-search.schema.ts";
import { Result } from "../../shared/result.ts";
import { parseOrThrow } from "../parse-request.ts";
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

  browseProvisionTreeHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: BrowseProvisionTreeDto = parseOrThrow(browseProvisionTreeSchema, {
      instrumentRef: req.params.instrumentRef,
      parentProvisionId: req.query.parentId,
    });
    const result = await this.browseProvisionTree.execute(validated);
    sendResult(res, result.success ? Result.ok(result.data.map((provision) => provision.toPublic())) : result);
  };

  getProvisionDetailHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: GetProvisionDetailDto = parseOrThrow(getProvisionDetailSchema, {
      provisionId: req.params.provisionId,
    });
    const result = await this.getProvisionDetail.execute(validated);
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

  searchCatalogueHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: SearchCatalogueDto = parseOrThrow(searchCatalogueSchema, req.query);
    const result = await this.searchCatalogue.execute(validated);
    sendResult(res, result.success ? Result.ok(result.data.map((provision) => provision.toPublic())) : result);
  };

  getFacetsHandler = async (_req: Request, res: Response): Promise<void> => {
    const facets = await this.getFacets.execute();
    res.status(200).json(facets);
  };

  listProvisionsHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: ListProvisionsDto = parseOrThrow(listProvisionsSchema, req.query);
    const result = await this.listProvisions.execute(validated);
    sendResult(
      res,
      result.success
        ? Result.ok({ items: result.data.items.map((provision) => provision.toPublic()), total: result.data.total })
        : result,
    );
  };

  semanticSearchHandler = async (req: Request, res: Response): Promise<void> => {
    const validated: SemanticSearchDto = parseOrThrow(semanticSearchSchema, req.query);
    const result = await this.semanticSearchProvisions.execute(validated);
    sendResult(res, result);
  };
}
