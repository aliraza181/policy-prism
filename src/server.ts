import { loadConfig } from "./infrastructure/config/config.ts";
import { createDriver, verifyConnectivity } from "./infrastructure/database/driver.ts";
import { Neo4jRegulatoryInstrumentRepository } from "./infrastructure/repositories/neo4j-regulatory-instrument/neo4j-regulatory-instrument.repository.ts";
import { Neo4jProvisionRepository } from "./infrastructure/repositories/neo4j-provision/neo4j-provision.repository.ts";
import { Neo4jNormativeStatementRepository } from "./infrastructure/repositories/neo4j-normative-statement/neo4j-normative-statement.repository.ts";
import { Neo4jPolicyRepository } from "./infrastructure/repositories/neo4j-policy/neo4j-policy.repository.ts";
import { Neo4jAssessmentRepository } from "./infrastructure/repositories/neo4j-assessment/neo4j-assessment.repository.ts";
import { Neo4jCoverageReviewRepository } from "./infrastructure/repositories/neo4j-coverage-review/neo4j-coverage-review.repository.ts";
import { Neo4jHospitalProfileRepository } from "./infrastructure/repositories/neo4j-hospital-profile/neo4j-hospital-profile.repository.ts";
import { Neo4jObligationRepository } from "./infrastructure/repositories/neo4j-obligation/neo4j-obligation.repository.ts";
import { HttpRagService } from "./infrastructure/services/http-rag-service/http-rag-service.ts";
import { HttpPolicyPipelineService } from "./infrastructure/services/http-policy-pipeline-service/http-policy-pipeline-service.ts";
import { ListInstrumentsUseCase } from "./application/list-instruments/list-instruments.usecase.ts";
import { BrowseProvisionTreeUseCase } from "./application/browse-provision-tree/browse-provision-tree.usecase.ts";
import { GetProvisionDetailUseCase } from "./application/get-provision-detail/get-provision-detail.usecase.ts";
import { SearchCatalogueUseCase } from "./application/search-catalogue/search-catalogue.usecase.ts";
import { GetFacetsUseCase } from "./application/get-facets/get-facets.usecase.ts";
import { ListProvisionsUseCase } from "./application/list-provisions/list-provisions.usecase.ts";
import { SemanticSearchProvisionsUseCase } from "./application/semantic-search-provisions/semantic-search-provisions.usecase.ts";
import { UploadPolicyUseCase } from "./application/upload-policy/upload-policy.usecase.ts";
import { AuthorPolicyUseCase } from "./application/author-policy/author-policy.usecase.ts";
import { GetJobStatusUseCase } from "./application/get-job-status/get-job-status.usecase.ts";
import { ListPoliciesUseCase } from "./application/list-policies/list-policies.usecase.ts";
import { GetPolicyDetailUseCase } from "./application/get-policy-detail/get-policy-detail.usecase.ts";
import { SubmitAssessmentRunUseCase } from "./application/submit-assessment-run/submit-assessment-run.usecase.ts";
import { GetRunUseCase } from "./application/get-run/get-run.usecase.ts";
import { ListAssessmentRunsUseCase } from "./application/list-assessment-runs/list-assessment-runs.usecase.ts";
import { ListGapsUseCase } from "./application/list-gaps/list-gaps.usecase.ts";
import { GetObligationCoverageUseCase } from "./application/get-obligation-coverage/get-obligation-coverage.usecase.ts";
import { SubmitCoverageReviewUseCase } from "./application/submit-coverage-review/submit-coverage-review.usecase.ts";
import { GetHospitalProfileUseCase } from "./application/get-hospital-profile/get-hospital-profile.usecase.ts";
import { ListHospitalProfilesUseCase } from "./application/list-hospital-profiles/list-hospital-profiles.usecase.ts";
import { ListObligationsUseCase } from "./application/list-obligations/list-obligations.usecase.ts";
import { SubmitObligationReviewUseCase } from "./application/submit-obligation-review/submit-obligation-review.usecase.ts";
import { CatalogueController } from "./http/controllers/catalogue.controller.ts";
import { PolicyController } from "./http/controllers/policy.controller.ts";
import { AssessmentController } from "./http/controllers/assessment.controller.ts";
import { CoverageReviewController } from "./http/controllers/coverage-review.controller.ts";
import { HospitalProfileController } from "./http/controllers/hospital-profile.controller.ts";
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
  const hospitalProfileRepo = new Neo4jHospitalProfileRepository(driver);
  const obligationRepo = new Neo4jObligationRepository(driver);

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
    new AuthorPolicyUseCase(policyPipelineService),
    new GetJobStatusUseCase(policyPipelineService),
    new ListPoliciesUseCase(policyRepo),
    new GetPolicyDetailUseCase(policyRepo),
  );

  const assessmentController = new AssessmentController(
    new SubmitAssessmentRunUseCase(policyPipelineService),
    new GetRunUseCase(assessmentRepo),
    new ListAssessmentRunsUseCase(assessmentRepo),
    new ListGapsUseCase(assessmentRepo),
  );

  const coverageReviewController = new CoverageReviewController(
    new GetObligationCoverageUseCase(coverageReviewRepo),
    new SubmitCoverageReviewUseCase(coverageReviewRepo),
  );

  const hospitalProfileController = new HospitalProfileController(
    new GetHospitalProfileUseCase(hospitalProfileRepo),
    new ListHospitalProfilesUseCase(hospitalProfileRepo),
    new ListObligationsUseCase(obligationRepo),
    new SubmitObligationReviewUseCase(obligationRepo),
  );

  const app = createApp({
    driver,
    catalogueController,
    policyController,
    assessmentController,
    coverageReviewController,
    hospitalProfileController,
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
