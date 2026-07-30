import type { z } from "zod";
import type { browseProvisionTreeSchema } from "../schemas/browse-provision-tree.schema.js";

export type BrowseProvisionTreeDto = z.infer<typeof browseProvisionTreeSchema>;
