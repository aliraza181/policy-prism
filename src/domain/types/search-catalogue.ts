import type { z } from "zod";
import type { searchCatalogueSchema } from "../schemas/search-catalogue.schema.js";

export type SearchCatalogueDto = z.infer<typeof searchCatalogueSchema>;
