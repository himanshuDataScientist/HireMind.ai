"use client";
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import JobCard from "@/components/JobCard";
export default function Recommended() {
  const me = useQuery(api.users.me); const recs = useQuery(api.recommend.forMe);
  if (me === undefined || recs === undefined) return <p className="pt-10 text-mist">Scoring jobs…</p>;
  if (!me) return <div className="pt-10"><h1 className="text-3xl font-bold">Recommended for you</h1><p className="text-mist mt-3">Add your skills and preferences to get matches. <Link className="text-saffron underline" href="/profile">Complete profile</Link></p></div>;
  return (<div className="pt-10"><p className="section-kicker">PERSONALIZED DISCOVERY</p><h1 className="text-3xl md:text-4xl font-bold mb-2">Recommended for you</h1>
    <p className="text-mist mb-8 text-sm">Your match score weighs skills (50%), title (20%), description (20%), and experience and salary fit (10%). Hover over a role for one second to focus its details.</p>
    <div className="job-grid">{recs.map(r => <div key={r.job._id}><JobCard job={r.job} company={r.company} score={r.score} />
      <p className="text-xs text-mist mt-2 px-1">Skills {Math.round(r.parts.skills * 100)}% · Title {Math.round(r.parts.title * 100)}% · Description {Math.round(r.parts.description * 100)}% · Fit {Math.round(r.parts.numeric * 100)}%</p></div>)}</div></div>);
}
