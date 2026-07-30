import type { Driver, Session } from "neo4j-driver";

/**
 * Every repository adapter opens/closes its session through this helper so
 * that pattern lives in exactly one place.
 */
export async function withSession<T>(driver: Driver, work: (session: Session) => Promise<T>): Promise<T> {
  const session = driver.session();
  try {
    return await work(session);
  } finally {
    await session.close();
  }
}
