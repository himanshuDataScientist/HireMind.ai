import Link from "next/link";
import GraphHero from "@/components/GraphHero";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const jobs = await fetchQuery(api.jobs.list, {});

  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">Skills → Graph → Match</span>
          <h1>Job matching that follows your actual network.</h1>
          <p>
            HireMind.ai pairs a normal application database with a real graph of skills, people,
            and roles — so recommendations come from who you're connected to and what you
            already know, not a keyword search.
          </p>
        </div>
        <GraphHero />
      </section>

      <h2 style={{ marginBottom: 16 }}>Open roles</h2>
      {jobs.length === 0 ? (
        <div className="empty">
          No jobs posted yet. <Link href="/post-job">Post the first one →</Link>
        </div>
      ) : (
        jobs.map((job) => (
          <Link key={job._id} href={`/jobs/${job._id}`} style={{ textDecoration: "none" }}>
            <div className="card">
              <div className="card-title">{job.title}</div>
              <div className="card-meta">
                {job.company} · {job.domain}
              </div>
              <div>
                {job.requiredSkills.map((s: string) => (
                  <span className="tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))
      )}
    </>
  );
}
