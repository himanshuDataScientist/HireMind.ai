import neo4j, { Driver } from "neo4j-driver";

// Server-only. Never import this file from a Client Component —
// credentials must never reach the browser bundle.
let driver: Driver | null = null;

export function getDriver(): Driver {
  if (driver) return driver;

  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;

  if (!uri || !username || !password) {
    throw new Error(
      "Missing NEO4J_URI / NEO4J_USERNAME / NEO4J_PASSWORD env vars. " +
        "Set these in .env.local (dev) or your Vercel project settings (prod)."
    );
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  return driver;
}

export async function runQuery(cypher: string, params: Record<string, unknown> = {}) {
  const session = getDriver().session();
  try {
    const result = await session.run(cypher, params);
    return result.records;
  } finally {
    await session.close();
  }
}
