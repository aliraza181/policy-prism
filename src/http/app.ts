import express, { type Express, type NextFunction, type Request, type Response } from "express";
import type { Driver } from "neo4j-driver";

import { ValidationError } from "../shared/errors.ts";
import { healthRouter } from "./routes/health.route.ts";
import { catalogueRouter } from "./routes/catalogue.router.ts";
import type { CatalogueController } from "./controllers/catalogue.controller.ts";
import { policyRouter } from "./routes/policy.router.ts";
import type { PolicyController } from "./controllers/policy.controller.ts";
import { assessmentRouter } from "./routes/assessment.router.ts";
import type { AssessmentController } from "./controllers/assessment.controller.ts";
import { coverageReviewRouter } from "./routes/coverage-review.router.ts";
import type { CoverageReviewController } from "./controllers/coverage-review.controller.ts";
import { hospitalProfileRouter } from "./routes/hospital-profile.router.ts";
import type { HospitalProfileController } from "./controllers/hospital-profile.controller.ts";

export interface AppDeps {
  driver: Driver;
  catalogueController: CatalogueController;
  policyController: PolicyController;
  assessmentController: AssessmentController;
  coverageReviewController: CoverageReviewController;
  hospitalProfileController: HospitalProfileController;
  frontendOrigin: string;
}

export function createApp(deps: AppDeps): Express {
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", deps.frontendOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  app.use(healthRouter(deps.driver));
  app.use(catalogueRouter(deps.catalogueController));
  app.use(policyRouter(deps.policyController));
  app.use(assessmentRouter(deps.assessmentController));
  app.use(coverageReviewRouter(deps.coverageReviewController));
  app.use(hospitalProfileRouter(deps.hospitalProfileController));

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.kind, message: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("unhandled error", message);
    res.status(500).json({ error: "internal_error", message });
  });

  return app;
}
