import { z } from "zod";

export const authorPolicySchema = z.object({
  title: z.string().min(1, "title is required"),
  bodyText: z.string().min(1, "bodyText is required"),
  department: z.string().min(1).optional(),
  owner: z.string().min(1).optional(),
  policyNumber: z.string().min(1).optional(),
  effectiveDate: z.string().min(1).optional(),
  nextReviewDate: z.string().min(1).optional(),
  keywords: z.array(z.string()).optional(),
  revisionType: z.string().min(1).optional(),
  hospitalProfileId: z.string().min(1).optional(),
});
