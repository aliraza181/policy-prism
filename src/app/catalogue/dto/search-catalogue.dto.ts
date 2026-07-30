import { z } from "zod";

export const searchCatalogueSchema = z.object({
  keyword: z.string().min(1, "keyword is required"),
  instrumentRef: z.string().min(1).optional(),
});

export type SearchCatalogueDto = z.infer<typeof searchCatalogueSchema>;
