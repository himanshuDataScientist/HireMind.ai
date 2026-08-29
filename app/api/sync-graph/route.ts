import { NextRequest, NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

// POST body: { jobId, title, domain, skills: string[] }
// Called right after a job is inserted into Convex. Convex is the
// source of truth for the job record; this just mirrors the parts
// Neo4j needs (id, title, domain, REQUIRES->Skill edges) so graph
// queries (matching, clustering, career paths) can run against it.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, title, domain, skills } = body as {
      jobId: string;
      title: string;
      domain: string;
      skills: string[];
    };

    if (!jobId || !title || !Array.isArray(skills)) {
      return NextResponse.json({ error: "jobId, title, and skills[] are required" }, { status: 400 });
    }

    await runQuery(
      `
      MERGE (j:Job {id: $jobId})
      SET j.title = $title, j.domain = $domain
      WITH j
      UNWIND $skills AS skillName
      MERGE (s:Skill {name: skillName})
      MERGE (j)-[:REQUIRES]->(s)
      MERGE (d:Domain {name: $domain})
      MERGE (j)-[:BELONGS_TO]->(d)
      `,
      { jobId, title, domain, skills }
    );

    return NextResponse.json({ synced: true });
  } catch (err: any) {
    // If this fails, Convex still has the job — it just won't show up
    // in graph-based matching/notifications until re-synced. Surface
    // the failure clearly rather than silently dropping it.
    console.error("Neo4j sync failed:", err);
    return NextResponse.json({ error: err.message ?? "sync failed" }, { status: 500 });
  }
}
