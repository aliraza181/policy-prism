import neo4j, { type Driver } from "neo4j-driver";

import type { AppConfig } from "../config/config.js";

export function createDriver(config: AppConfig): Driver {
  return neo4j.driver(config.neo4j.uri, neo4j.auth.basic(config.neo4j.username, config.neo4j.password));
}

export async function verifyConnectivity(driver: Driver): Promise<void> {
  await driver.verifyConnectivity();
}
