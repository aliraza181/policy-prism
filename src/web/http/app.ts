import express, { type Express, type NextFunction, type Request, type Response } from "express";
import type { Driver } from "neo4j-driver";

import type { Logger } from "../../app/shared/ports.js";
import { healthRouter } from "./health.route.js";
import { catalogueRouter } from "./catalogue/catalogue.router.js";
import type { CatalogueController } from "./catalogue/catalogue.controller.js";
import { hospitalProfileRouter } from "./hospital-profile/hospital-profile.router.js";
import type { HospitalProfileController } from "./hospital-profile/hospital-profile.controller.js";
import { policyRouter } from "./policy/policy.router.js";
import type { PolicyController } from "./policy/policy.controller.js";
import { assessmentRouter } from "./assessment/assessment.router.js";
import type { AssessmentController } from "./assessment/assessment.controller.js";
import { coverageReviewRouter } from "./coverage-review/coverage-review.router.js";
import type { CoverageReviewController } from "./coverage-review/coverage-review.controller.js";

export interface AppDeps {
  driver: Driver;
  logger: Logger;
  catalogueController: CatalogueController;
  hospitalProfileController: HospitalProfileController;
  policyController: PolicyController;
  assessmentController: AssessmentController;
  coverageReviewController: CoverageReviewController;
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
    deps.logger.info(`${req.method} ${req.path}`);
    next();
  });

  app.use(healthRouter(deps.driver));
  app.use(catalogueRouter(deps.catalogueController));
  app.use(hospitalProfileRouter(deps.hospitalProfileController));
  app.use(policyRouter(deps.policyController));
  app.use(assessmentRouter(deps.assessmentController));
  app.use(coverageReviewRouter(deps.coverageReviewController));

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const message = err instanceof Error ? err.message : "unknown error";
    deps.logger.error("unhandled error", { message });
    res.status(500).json({ error: "internal_error", message });
  });

  return app;
}
