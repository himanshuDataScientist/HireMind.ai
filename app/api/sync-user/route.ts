import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

// POST body: { userId, name, domain, skills: string[] }
export async function POST(req: NextRequest) {
  try {
    const { userId, name, domain, skills } = await req.json();

    if (!userId || !Array.isArray(skills)) {
      return NextResponse.json({ error: "userId and skills[] are required" }, { status: 400 });
    }

    await runQuery(
      `
      MERGE (u:User {id: $userId})
      SET u.name = $name
      WITH u
      UNWIND $skills AS skillName
      MERGE (s:Skill {name: skillName})
      MERGE (u)-[:HAS_SKILL]->(s)
      FOREACH (_ IN CASE WHEN $domain IS NULL THEN [] ELSE [1] END |
        MERGE (d:Domain {name: $domain})
        MERGE (u)-[:INTERESTED_IN]->(d)
      )
      `,
      { userId, name: name ?? "", domain: domain ?? null, skills }
    );

    return NextResponse.json({ synced: true });
  } catch (err: any) {
    console.error("Neo4j user sync failed:", err);
    return NextResponse.json({ error: err.message ?? "sync failed" }, { status: 500 });
  }
}
