import { loadConfig } from "./infrastructure/config/config.ts";
import { createDriver, verifyConnectivity } from "./infrastructure/database/driver.ts";
import { Neo4jRegulatoryInstrumentRepository } from "./infrastructure/repositories/neo4j-regulatory-instrument.repository.ts";
import { Neo4jProvisionRepository } from "./infrastructure/repositories/neo4j-provision.repository.ts";
import { Neo4jNormativeStatementRepository } from "./infrastructure/repositories/neo4j-normative-statement.repository.ts";
import { Neo4jPolicyRepository } from "./infrastructure/repositories/neo4j-policy.repository.ts";
import { Neo4jAssessmentRepository } from "./infrastructure/repositories/neo4j-assessment.repository.ts";
import { Neo4jCoverageReviewRepository } from "./infrastructure/repositories/neo4j-coverage-review.repository.ts";
import { HttpRagService } from "./infrastructure/external-services/http-rag-service.ts";
import { HttpPolicyPipelineService } from "./infrastructure/external-services/http-policy-pipeline-service.ts";
import { ListInstrumentsUseCase } from "./application/services/list-instruments.usecase.ts";
import { BrowseProvisionTreeUseCase } from "./application/services/browse-provision-tree.usecase.ts";
import { GetProvisionDetailUseCase } from "./application/services/get-provision-detail.usecase.ts";
import { SearchCatalogueUseCase } from "./application/services/search-catalogue.usecase.ts";
import { GetFacetsUseCase } from "./application/services/get-facets.usecase.ts";
import { ListProvisionsUseCase } from "./application/services/list-provisions.usecase.ts";
import { SemanticSearchProvisionsUseCase } from "./application/services/semantic-search-provisions.usecase.ts";
import { UploadPolicyUseCase } from "./application/services/upload-policy.usecase.ts";
import { GetJobStatusUseCase } from "./application/services/get-job-status.usecase.ts";
import { ListPoliciesUseCase } from "./application/services/list-policies.usecase.ts";
import { GetPolicyDetailUseCase } from "./application/services/get-policy-detail.usecase.ts";
import { SubmitAssessmentRunUseCase } from "./application/services/submit-assessment-run.usecase.ts";
import { GetRunUseCase } from "./application/services/get-run.usecase.ts";
import { ListGapsUseCase } from "./application/services/list-gaps.usecase.ts";
import { GetObligationCoverageUseCase } from "./application/services/get-obligation-coverage.usecase.ts";
import { SubmitCoverageReviewUseCase } from "./application/services/submit-coverage-review.usecase.ts";
import { CatalogueController } from "./http/controllers/catalogue.controller.ts";
import { PolicyController } from "./http/controllers/policy.controller.ts";
import { AssessmentController } from "./http/controllers/assessment.controller.ts";
import { CoverageReviewController } from "./http/controllers/coverage-review.controller.ts";
import { createApp } from "./http/app.ts";

async function main(): Promise<void> {
  const config = loadConfig();

  const driver = createDriver(config);
  await verifyConnectivity(driver);
  console.log(`Connected to Neo4j: ${config.neo4j.uri}`);

  const instrumentRepo = new Neo4jRegulatoryInstrumentRepository(driver);
  const provisionRepo = new Neo4jProvisionRepository(driver);
  const normativeStatementRepo = new Neo4jNormativeStatementRepository(driver);
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
    catalogueController,
    policyController,
    assessmentController,
    coverageReviewController,
    frontendOrigin: config.frontendOrigin,
  });

  app.listen(config.port, () => {
    console.log(`Policy Prism backend listening on port ${config.port}`);
  });
}

main().catch((error: unknown) => {
  console.error("Fatal startup error:", error);
  process.exit(1);
});
