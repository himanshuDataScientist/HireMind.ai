"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const createJob = useMutation(api.jobs.create);
  const markSynced = useMutation(api.jobs.markGraphSynced);
  const notifyMatches = useMutation(api.notifications.createForMatches);

  // In a real app this comes from auth; for the scaffold, use/create a
  // demo recruiter user so the form works end-to-end out of the box.
  const demoRecruiter = useQuery(api.users.getByEmail, { email: "recruiter@demo.com" });
  const createUser = useMutation(api.users.create);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState("AI/ML");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Saving job…");

    let recruiterId = demoRecruiter?._id;
    if (!recruiterId) {
      recruiterId = await createUser({
        name: "Demo Recruiter",
        email: "recruiter@demo.com",
        role: "recruiter",
        skills: [],
      });
    }

    const requiredSkills = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const jobId = await createJob({
      title,
      company,
      description,
      domain,
      requiredSkills,
      postedBy: recruiterId,
    });

    setStatus("Syncing to the graph…");
    const syncRes = await fetch("/api/sync-graph", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId, title, domain, skills: requiredSkills }),
    });

    if (syncRes.ok) {
      await markSynced({ id: jobId });

      setStatus("Finding matching people in the network…");
      const matchRes = await fetch(`/api/graph-match?jobId=${jobId}`);
      const { matches } = await matchRes.json();

      // matches[].userId are Neo4j-side ids we set equal to Convex user _ids,
      // so they can be used directly to write Convex notifications.
      if (matches?.length) {
        await notifyMatches({
          jobId,
          userIds: matches.map((m: any) => m.userId),
          message: `New ${title} role at ${company} matches your skills`,
        });
      }
    } else {
      setStatus("Job saved, but the graph sync failed — it won't appear in matching yet.");
    }

    router.push(`/jobs/${jobId}`);
  }

  return (
    <>
      <h1>Post a job</h1>
      <p style={{ color: "var(--ink-dim)", marginTop: -8, marginBottom: 24 }}>
        Saved to Convex, then mirrored into Neo4j so it's immediately part of skill matching.
      </p>
      <form onSubmit={handleSubmit} className="card">
        <label htmlFor="title">Title</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label htmlFor="company">Company</label>
        <input id="company" value={company} onChange={(e) => setCompany(e.target.value)} required />

        <label htmlFor="domain">Domain</label>
        <input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} required />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="skills">Required skills (comma-separated)</label>
        <input
          id="skills"
          placeholder="Python, SQL, Machine Learning"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        />

        <button className="btn" type="submit">
          Post job
        </button>
        {status && <p style={{ color: "var(--ink-dim)", marginTop: 12 }}>{status}</p>}
      </form>
    </>
  );
}
