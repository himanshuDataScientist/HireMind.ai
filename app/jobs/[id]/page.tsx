"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const jobId = params.id as Id<"jobs">;
  const job = useQuery(api.jobs.get, { id: jobId });
  const apply = useMutation(api.applications.apply);

  const [mySkills, setMySkills] = useState("Python, SQL");
  const [gap, setGap] = useState<{ matched: string[]; missing: string[]; readiness: number } | null>(
    null
  );
  const [matches, setMatches] = useState<{ userId: string; name: string; matchingSkills: number }[]>(
    []
  );

  useEffect(() => {
    if (!job) return;
    fetch(`/api/graph-match?jobId=${jobId}`)
      .then((r) => r.json())
      .then((d) => setMatches(d.matches ?? []))
      .catch(() => setMatches([]));
  }, [job, jobId]);

  async function checkGap() {
    if (!job) return;
    const res = await fetch("/api/skill-gap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userSkills: mySkills.split(",").map((s) => s.trim()),
        requiredSkills: job.requiredSkills,
      }),
    });
    setGap(await res.json());
  }

  if (job === undefined) return <p>Loading…</p>;
  if (job === null) return <p>Job not found.</p>;

  return (
    <>
      <span className="eyebrow">{job.domain}</span>
      <h1>{job.title}</h1>
      <p className="card-meta">{job.company}</p>
      <p>{job.description}</p>

      <h2 style={{ marginTop: 32 }}>Required skills</h2>
      <div>
        {job.requiredSkills.map((s: string) => (
          <span className="tag" key={s}>
            {s}
          </span>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-title">Check your skill gap</div>
        <label htmlFor="my-skills">Your skills (comma-separated)</label>
        <input id="my-skills" value={mySkills} onChange={(e) => setMySkills(e.target.value)} />
        <button className="btn secondary" onClick={checkGap} type="button">
          Analyze
        </button>

        {gap && (
          <div style={{ marginTop: 16 }}>
            <p className="card-meta">{gap.readiness}% ready for this role</p>
            {gap.matched.map((s) => (
              <span className="tag matched" key={s}>
                ✓ {s}
              </span>
            ))}
            {gap.missing.map((s) => (
              <span className="tag missing" key={s}>
                + {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">People in the network who match</div>
        {matches.length === 0 ? (
          <p className="card-meta">No graph matches yet — sync users' skills via /api/sync-user.</p>
        ) : (
          matches.map((m) => (
            <p key={m.userId} className="card-meta">
              {m.name} — {m.matchingSkills} overlapping skills
            </p>
          ))
        )}
      </div>

      <button
        className="btn"
        onClick={async () => {
          // demo seeker id — see README for wiring real auth
          const seeker = "demo-seeker" as Id<"users">;
          await apply({ jobId, userId: seeker }).catch(() => {});
        }}
      >
        Apply
      </button>
    </>
  );
}
