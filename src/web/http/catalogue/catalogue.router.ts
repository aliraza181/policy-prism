import { Router } from "express";

import type { CatalogueController } from "./catalogue.controller.js";
import { asyncHandler } from "../async-handler.js";

export function catalogueRouter(controller: CatalogueController): Router {
  const router = Router();

  router.get("/instruments", asyncHandler(controller.listInstrumentsHandler));
  router.get("/instruments/:instrumentRef/provisions", asyncHandler(controller.browseProvisionTreeHandler));
  router.get("/provisions/:provisionId", asyncHandler(controller.getProvisionDetailHandler));
  router.get("/catalogue/search", asyncHandler(controller.searchCatalogueHandler));
  router.get("/catalogue/semantic-search", asyncHandler(controller.semanticSearchHandler));
  router.get("/catalogue/facets", asyncHandler(controller.getFacetsHandler));
  router.get("/catalogue/provisions", asyncHandler(controller.listProvisionsHandler));

  return router;
}
