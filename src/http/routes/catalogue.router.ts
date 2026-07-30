import { Router } from "express";

import type { CatalogueController } from "../controllers/catalogue.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validate } from "../middleware/validate.js";
import { browseProvisionTreeSchema } from "../../application/dtos/browse-provision-tree.dto.js";
import { getProvisionDetailSchema } from "../../application/dtos/get-provision-detail.dto.js";
import { searchCatalogueSchema } from "../../application/dtos/search-catalogue.dto.js";
import { semanticSearchSchema } from "../../application/dtos/semantic-search.dto.js";
import { listProvisionsSchema } from "../../application/dtos/list-provisions.dto.js";

export function catalogueRouter(controller: CatalogueController): Router {
  const router = Router();

  router.get("/instruments", asyncHandler(controller.listInstrumentsHandler));

  router.get(
    "/instruments/:instrumentRef/provisions",
    validate(browseProvisionTreeSchema, (req) => ({
      instrumentRef: req.params.instrumentRef,
      parentProvisionId: req.query.parentId,
    })),
    asyncHandler(controller.browseProvisionTreeHandler),
  );

  router.get(
    "/provisions/:provisionId",
    validate(getProvisionDetailSchema, (req) => ({ provisionId: req.params.provisionId })),
    asyncHandler(controller.getProvisionDetailHandler),
  );

  router.get(
    "/catalogue/search",
    validate(searchCatalogueSchema, (req) => req.query),
    asyncHandler(controller.searchCatalogueHandler),
  );

  router.get(
    "/catalogue/semantic-search",
    validate(semanticSearchSchema, (req) => req.query),
    asyncHandler(controller.semanticSearchHandler),
  );

  router.get("/catalogue/facets", asyncHandler(controller.getFacetsHandler));

  router.get(
    "/catalogue/provisions",
    validate(listProvisionsSchema, (req) => req.query),
    asyncHandler(controller.listProvisionsHandler),
  );

  return router;
}
