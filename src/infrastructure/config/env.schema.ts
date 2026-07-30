import { z } from "zod";

export const envSchema = z.object({
  NEO4J_URI: z.string().min(1, "NEO4J_URI is required"),
  NEO4J_USERNAME: z.string().min(1, "NEO4J_USERNAME is required"),
  NEO4J_PASSWORD: z.string().min(1, "NEO4J_PASSWORD is required"),
  PORT: z.coerce.number().int().positive().default(3000),
  FRONTEND_ORIGIN: z.string().min(1).default("http://localhost:5173"),
  // The Python RAG microservice (pipeline/prism/rag/service.py) - it owns embeddings
  // (local model) and answer synthesis (MiniMax), this backend just proxies to it.
  RAG_SERVICE_URL: z.string().min(1).default("http://localhost:8000"),
  // The Python policy intake + assessment microservice (pipeline/prism/policy/service.py) -
  // covers both the policy and assessment slices, since they share one Python service.
  POLICY_SERVICE_URL: z.string().min(1).default("http://localhost:8001"),
});

export type Env = z.infer<typeof envSchema>;
