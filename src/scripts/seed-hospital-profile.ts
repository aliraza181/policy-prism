import { loadConfig } from "../infrastructure/config/config.js";
import { ConsoleLogger } from "../infrastructure/logging/console-logger.js";
import { createDriver, verifyConnectivity } from "../infrastructure/database/driver.js";
import { Neo4jHospitalProfileRepository } from "../infrastructure/repositories/neo4j-hospital-profile.repository.js";
import { HospitalProfile } from "../domain/entities/hospital-profile.entity.js";
import type { Facility, ProfileFact } from "../domain/entities/hospital-profile.entity.js";

const FACILITIES: Facility[] = [
  {
    facilityId: "hph-kapiolani",
    facilityName: "Kapiolani Medical Center for Women & Children",
    facilityType: "hospital",
    licenseClass: "general_acute_care_hospital",
  },
  {
    facilityId: "hph-pali-momi",
    facilityName: "Pali Momi Medical Center",
    facilityType: "hospital",
    licenseClass: "general_acute_care_hospital",
  },
  {
    facilityId: "hph-straub",
    facilityName: "Straub Medical Center",
    facilityType: "hospital",
    licenseClass: "general_acute_care_hospital",
  },
  {
    facilityId: "hph-wilcox",
    facilityName: "Wilcox Medical Center",
    facilityType: "hospital",
    licenseClass: "general_acute_care_hospital",
  },
];

function factFor(key: string, facilityId: string): ProfileFact {
  return {
    key,
    status: "present",
    facilityId,
    value: null,
    posture: "authored",
    confidence: "confirmed",
    effectiveFrom: null,
    effectiveTo: null,
    evidenceRefs: [],
    notes: null,
  };
}

async function main(): Promise<void> {
  const config = loadConfig();
  const logger = new ConsoleLogger();

  const driver = createDriver(config);
  await verifyConnectivity(driver);
  logger.info("Connected to Neo4j", { uri: config.neo4j.uri });

  const repo = new Neo4jHospitalProfileRepository(driver);

  const profile = HospitalProfile.reconstitute({
    id: "hph-001",
    identity: {
      legalEntityName: "Hawaii Pacific Health",
      displayName: "Hawaii Pacific Health",
      jurisdiction: "US-HI",
      state: "HI",
    },
    facilities: FACILITIES,
    participationAndLicensure: FACILITIES.map((f) => factFor("participation.medicare", f.facilityId)),
    servicesAndCapabilities: FACILITIES.map((f) => factFor("services.emergencyServices", f.facilityId)),
    unitsAndCareSettings: FACILITIES.map((f) => factFor("units.emergencyDepartment", f.facilityId)),
    patientPopulationsAndServiceArea: FACILITIES.map((f) => factFor("population.medicarePatients", f.facilityId)),
    sourceScopeOverrides: [],
  });

  await repo.save(profile);
  logger.info("Seeded HospitalProfile", { id: profile.id, facilities: FACILITIES.length });

  await driver.close();
}

main().catch((error: unknown) => {
  console.error("Fatal seed error:", error);
  process.exit(1);
});
