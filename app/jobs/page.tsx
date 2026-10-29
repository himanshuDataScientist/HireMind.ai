"use client";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import JobCard from "@/components/JobCard";
import { LEVELS } from "@/lib/format";
export default function Jobs() {
  const [q, setQ] = useState(""); const [level, setLevel] = useState(""); const [sal, setSal] = useState(0);
  const jobs = useQuery(api.jobs.list, { q: q || undefined, level: level || undefined, minSalary: sal || undefined });
  return (<div className="pt-10"><p className="section-kicker">THE OPPORTUNITY BOARD</p><h1 className="text-3xl md:text-4xl font-bold mb-3">Find your next role.</h1><p className="text-mist max-w-2xl mb-7 leading-7">Search roles that fit your skills and goals. Hover over a card for one second to bring its details into focus.</p>
    <div className="grid md:grid-cols-4 gap-3 mb-8">
      <input className="input md:col-span-2" placeholder="Title, skill, company or city" value={q} onChange={e => setQ(e.target.value)} />
      <select className="input" value={level} onChange={e => setLevel(e.target.value)}><option value="">Any level</option>{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
      <select className="input" value={sal} onChange={e => setSal(+e.target.value)}><option value={0}>Any salary</option>{[500000, 1000000, 1500000, 2000000].map(s => <option key={s} value={s}>₹{s / 100000}+ LPA</option>)}</select></div>
    {!jobs ? <p className="text-mist">Loading jobs…</p> : jobs.length === 0 ? <p className="text-mist">No jobs match. Run <code>npx convex run seed:run</code> or loosen the filters.</p> :
      <div className="job-grid">{jobs.map(j => <JobCard key={j._id} job={j} company={j.company} />)}</div>}</div>);
}
