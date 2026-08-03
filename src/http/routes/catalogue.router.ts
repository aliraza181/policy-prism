import { Router } from "express";

import type { CatalogueController } from "../controllers/catalogue.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";
import { validate } from "../middleware/validate.ts";
import { browseProvisionTreeSchema } from "../../domain/schemas/browse-provision-tree.schema.ts";
import { getProvisionDetailSchema } from "../../domain/schemas/get-provision-detail.schema.ts";
import { searchCatalogueSchema } from "../../domain/schemas/search-catalogue.schema.ts";
import { semanticSearchSchema } from "../../domain/schemas/semantic-search.schema.ts";
import { listProvisionsSchema } from "../../domain/schemas/list-provisions.schema.ts";

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
