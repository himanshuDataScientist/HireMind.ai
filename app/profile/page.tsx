"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function ProfilePage() {
  const email = "you@demo.com";
  const user = useQuery(api.users.getByEmail, { email });
  const createUser = useMutation(api.users.create);
  const updateSkills = useMutation(api.users.updateSkills);

  const [name, setName] = useState("Demo Seeker");
  const [domain, setDomain] = useState("AI/ML");
  const [skills, setSkills] = useState("Python, SQL");
  const [status, setStatus] = useState<string | null>(null);

  async function save() {
    setStatus("Saving…");
    const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);

    const userId =
      user?._id ??
      (await createUser({ name, email, role: "seeker", skills: skillList, domain }));

    if (user) await updateSkills({ id: userId, skills: skillList });

    setStatus("Syncing to the graph…");
    await fetch("/api/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, name, domain, skills: skillList }),
    });
    setStatus("Saved and synced.");
  }

  return (
    <>
      <h1>Your profile</h1>
      <p style={{ color: "var(--ink-dim)", marginTop: -8, marginBottom: 24 }}>
        Skills here become graph edges, which is what powers matching and network notifications.
      </p>
      <div className="card">
        <label htmlFor="name">Name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="domain">Interested domain</label>
        <input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} />

        <label htmlFor="skills">Skills (comma-separated)</label>
        <input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} />

        <button className="btn" onClick={save} type="button">
          Save profile
        </button>
        {status && <p className="card-meta" style={{ marginTop: 12 }}>{status}</p>}
      </div>
    </>
  );
}
