import { loadConfig } from "./infrastructure/config/config.js";
import { ConsoleLogger } from "./infrastructure/logging/console-logger.js";
import { createDriver, verifyConnectivity } from "./infrastructure/database/driver.js";
import { Neo4jRegulatoryInstrumentRepository } from "./infrastructure/repositories/neo4j-regulatory-instrument.repository.js";
import { Neo4jProvisionRepository } from "./infrastructure/repositories/neo4j-provision.repository.js";
import { Neo4jNormativeStatementRepository } from "./infrastructure/repositories/neo4j-normative-statement.repository.js";
import { Neo4jHospitalProfileRepository } from "./infrastructure/repositories/neo4j-hospital-profile.repository.js";
import { Neo4jPolicyRepository } from "./infrastructure/repositories/neo4j-policy.repository.js";
import { Neo4jAssessmentRepository } from "./infrastructure/repositories/neo4j-assessment.repository.js";
import { Neo4jCoverageReviewRepository } from "./infrastructure/repositories/neo4j-coverage-review.repository.js";
import { HttpRagService } from "./infrastructure/external-services/http-rag-service.js";
import { HttpPolicyPipelineService } from "./infrastructure/external-services/http-policy-pipeline-service.js";
import { ListInstrumentsUseCase } from "./application/services/list-instruments.usecase.js";
import { BrowseProvisionTreeUseCase } from "./application/services/browse-provision-tree.usecase.js";
import { GetProvisionDetailUseCase } from "./application/services/get-provision-detail.usecase.js";
import { SearchCatalogueUseCase } from "./application/services/search-catalogue.usecase.js";
import { GetFacetsUseCase } from "./application/services/get-facets.usecase.js";
import { ListProvisionsUseCase } from "./application/services/list-provisions.usecase.js";
import { SemanticSearchProvisionsUseCase } from "./application/services/semantic-search-provisions.usecase.js";
import { GetHospitalProfileUseCase } from "./application/services/get-hospital-profile.usecase.js";
import { UploadPolicyUseCase } from "./application/services/upload-policy.usecase.js";
import { GetJobStatusUseCase } from "./application/services/get-job-status.usecase.js";
import { ListPoliciesUseCase } from "./application/services/list-policies.usecase.js";
import { GetPolicyDetailUseCase } from "./application/services/get-policy-detail.usecase.js";
import { SubmitAssessmentRunUseCase } from "./application/services/submit-assessment-run.usecase.js";
import { GetRunUseCase } from "./application/services/get-run.usecase.js";
import { ListGapsUseCase } from "./application/services/list-gaps.usecase.js";
import { GetObligationCoverageUseCase } from "./application/services/get-obligation-coverage.usecase.js";
import { SubmitCoverageReviewUseCase } from "./application/services/submit-coverage-review.usecase.js";
import { CatalogueController } from "./http/controllers/catalogue.controller.js";
import { HospitalProfileController } from "./http/controllers/hospital-profile.controller.js";
import { PolicyController } from "./http/controllers/policy.controller.js";
import { AssessmentController } from "./http/controllers/assessment.controller.js";
import { CoverageReviewController } from "./http/controllers/coverage-review.controller.js";
import { createApp } from "./http/app.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const logger = new ConsoleLogger();

  const driver = createDriver(config);
  await verifyConnectivity(driver);
  logger.info("Connected to Neo4j", { uri: config.neo4j.uri });

  const instrumentRepo = new Neo4jRegulatoryInstrumentRepository(driver);
  const provisionRepo = new Neo4jProvisionRepository(driver);
  const normativeStatementRepo = new Neo4jNormativeStatementRepository(driver);
  const hospitalProfileRepo = new Neo4jHospitalProfileRepository(driver);
  const policyRepo = new Neo4jPolicyRepository(driver);
  const assessmentRepo = new Neo4jAssessmentRepository(driver);
  const coverageReviewRepo = new Neo4jCoverageReviewRepository(driver);

  const ragService = new HttpRagService({ baseUrl: config.ragServiceUrl });
  const policyPipelineService = new HttpPolicyPipelineService({ baseUrl: config.policyServiceUrl });

  const catalogueController = new CatalogueController(
    new ListInstrumentsUseCase(instrumentRepo),
    new BrowseProvisionTreeUseCase(provisionRepo),
    new GetProvisionDetailUseCase(provisionRepo, normativeStatementRepo),
    new SearchCatalogueUseCase(provisionRepo),
    new GetFacetsUseCase(provisionRepo),
    new ListProvisionsUseCase(provisionRepo),
    new SemanticSearchProvisionsUseCase(ragService),
  );

  const hospitalProfileController = new HospitalProfileController(
    new GetHospitalProfileUseCase(hospitalProfileRepo),
  );

  const policyController = new PolicyController(
    new UploadPolicyUseCase(policyPipelineService),
    new GetJobStatusUseCase(policyPipelineService),
    new ListPoliciesUseCase(policyRepo),
    new GetPolicyDetailUseCase(policyRepo),
  );

  const assessmentController = new AssessmentController(
    new SubmitAssessmentRunUseCase(policyPipelineService),
    new GetRunUseCase(assessmentRepo),
    new ListGapsUseCase(assessmentRepo),
  );

  const coverageReviewController = new CoverageReviewController(
    new GetObligationCoverageUseCase(coverageReviewRepo),
    new SubmitCoverageReviewUseCase(coverageReviewRepo),
  );

  const app = createApp({
    driver,
    logger,
    catalogueController,
    hospitalProfileController,
    policyController,
    assessmentController,
    coverageReviewController,
    frontendOrigin: config.frontendOrigin,
  });

  app.listen(config.port, () => {
    logger.info(`Policy Prism backend listening on port ${config.port}`);
  });
}

main().catch((error: unknown) => {
  console.error("Fatal startup error:", error);
  process.exit(1);
});
