import { Router } from "express";
import type { Driver } from "neo4j-driver";

export function healthRouter(driver: Driver): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    driver
      .verifyConnectivity()
      .then(() => res.status(200).json({ status: "ok", neo4j: "connected" }))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "unknown error";
        res.status(503).json({ status: "degraded", neo4j: "unreachable", message });
      });
  });

  return router;
}
