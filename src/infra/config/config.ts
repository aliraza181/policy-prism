import { envSchema } from "./env.schema.js";

export interface AppConfig {
  readonly neo4j: {
    readonly uri: string;
    readonly username: string;
    readonly password: string;
  };
  readonly port: number;
  readonly frontendOrigin: string;
  readonly ragServiceUrl: string;
  readonly policyServiceUrl: string;
}

/**
 * Parsed once at startup. A malformed environment is a deployment bug, not
 * an expected outcome, so this fails fast rather than returning a Result.
 */
export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`Invalid environment configuration:\n${issues.join("\n")}`);
  }

  return {
    neo4j: {
      uri: parsed.data.NEO4J_URI,
      username: parsed.data.NEO4J_USERNAME,
      password: parsed.data.NEO4J_PASSWORD,
    },
    port: parsed.data.PORT,
    frontendOrigin: parsed.data.FRONTEND_ORIGIN,
    ragServiceUrl: parsed.data.RAG_SERVICE_URL,
    policyServiceUrl: parsed.data.POLICY_SERVICE_URL,
  };
}
