import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

// GET /api/graph-match?jobId=xyz
// Returns users ranked by number of overlapping required skills,
// plus each match's connections (for "people in your network" style results).
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "jobId query param is required" }, { status: 400 });
  }

  try {
    const records = await runQuery(
      `
      MATCH (u:User)-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job {id: $jobId})
      RETURN u.id AS userId, u.name AS name, count(s) AS matchingSkills
      ORDER BY matchingSkills DESC
      LIMIT 25
      `,
      { jobId }
    );

    const matches = records.map((r) => ({
      userId: r.get("userId"),
      name: r.get("name"),
      matchingSkills: r.get("matchingSkills").toNumber?.() ?? r.get("matchingSkills"),
    }));

    return NextResponse.json({ matches });
  } catch (err: any) {
    console.error("Graph match query failed:", err);
    return NextResponse.json({ error: err.message ?? "query failed" }, { status: 500 });
  }
}
