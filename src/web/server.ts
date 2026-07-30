import { loadConfig } from "../infra/config/config.js";
import { ConsoleLogger } from "../infra/logger/console-logger.js";
import { createDriver, verifyConnectivity } from "../infra/neo4j/driver.js";
import { Neo4jRegulatoryInstrumentRepository } from "../infra/neo4j/neo4j-regulatory-instrument.repository.js";
import { Neo4jProvisionRepository } from "../infra/neo4j/neo4j-provision.repository.js";
import { Neo4jNormativeStatementRepository } from "../infra/neo4j/neo4j-normative-statement.repository.js";
import { Neo4jHospitalProfileRepository } from "../infra/neo4j/neo4j-hospital-profile.repository.js";
import { Neo4jPolicyRepository } from "../infra/neo4j/neo4j-policy.repository.js";
import { Neo4jAssessmentRepository } from "../infra/neo4j/neo4j-assessment.repository.js";
import { Neo4jCoverageReviewRepository } from "../infra/neo4j/neo4j-coverage-review.repository.js";
import { HttpRagService } from "../infra/rag/http-rag-service.js";
import { HttpPolicyPipelineService } from "../infra/policy/http-policy-pipeline-service.js";
import { ListInstrumentsUseCase } from "../app/catalogue/list-instruments.usecase.js";
import { BrowseProvisionTreeUseCase } from "../app/catalogue/browse-provision-tree.usecase.js";
import { GetProvisionDetailUseCase } from "../app/catalogue/get-provision-detail.usecase.js";
import { SearchCatalogueUseCase } from "../app/catalogue/search-catalogue.usecase.js";
import { GetFacetsUseCase } from "../app/catalogue/get-facets.usecase.js";
import { ListProvisionsUseCase } from "../app/catalogue/list-provisions.usecase.js";
import { SemanticSearchProvisionsUseCase } from "../app/catalogue/semantic-search-provisions.usecase.js";
import { GetHospitalProfileUseCase } from "../app/hospital-profile/get-hospital-profile.usecase.js";
import { UploadPolicyUseCase } from "../app/policy/upload-policy.usecase.js";
import { GetJobStatusUseCase } from "../app/policy/get-job-status.usecase.js";
import { ListPoliciesUseCase } from "../app/policy/list-policies.usecase.js";
import { GetPolicyDetailUseCase } from "../app/policy/get-policy-detail.usecase.js";
import { SubmitAssessmentRunUseCase } from "../app/assessment/submit-assessment-run.usecase.js";
import { GetRunUseCase } from "../app/assessment/get-run.usecase.js";
import { ListGapsUseCase } from "../app/assessment/list-gaps.usecase.js";
import { GetObligationCoverageUseCase } from "../app/coverage-review/get-obligation-coverage.usecase.js";
import { SubmitCoverageReviewUseCase } from "../app/coverage-review/submit-coverage-review.usecase.js";
import { CatalogueController } from "./http/catalogue/catalogue.controller.js";
import { HospitalProfileController } from "./http/hospital-profile/hospital-profile.controller.js";
import { PolicyController } from "./http/policy/policy.controller.js";
import { AssessmentController } from "./http/assessment/assessment.controller.js";
import { CoverageReviewController } from "./http/coverage-review/coverage-review.controller.js";
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
