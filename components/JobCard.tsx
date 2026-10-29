"use client";
import { useMutation } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import Tilt from "./Tilt";
import { lpa } from "@/lib/format";
import { useEffect, useRef, useState } from "react";
export default function JobCard({ job, company, score }: { job: any; company: any; score?: number }) {
  const apply = useMutation(api.applications.apply);
  const { isSignedIn } = useAuth();
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState(false);
  const [applying, setApplying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearFocusTimer = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  const startFocusTimer = () => { clearFocusTimer(); timer.current = setTimeout(() => setFocused(true), 1000); };
  useEffect(() => () => clearFocusTimer(), []);
  const handleApply = async () => {
    if (!isSignedIn || done || applying) return;
    setApplying(true);
    try { await apply({ jobId: job._id }); setDone(true); }
    catch (error) { console.error("Could not apply for job", error); }
    finally { setApplying(false); }
  };
  return <div className={`job-card ${focused ? "job-card-focus" : ""}`} onMouseEnter={startFocusTimer} onMouseLeave={() => { clearFocusTimer(); setFocused(false); }} onFocus={startFocusTimer} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) { clearFocusTimer(); setFocused(false); } }}>
    <Tilt className="p-5 h-full flex flex-col gap-3">
      <div className="lift flex justify-between gap-3"><div><h3 className="font-semibold text-lg leading-tight">{job.title}</h3><p className="text-mist text-sm mt-1">{company?.name ?? "Company under review"} · {job.location}</p><p className="text-xs text-mist mt-1">{company?.isVerified ? <span className="text-aqua">✓ Company listed</span> : <span>Company verification pending</span>}</p></div>
        {score !== undefined && <div className="text-right shrink-0"><div className="text-2xl font-display font-bold text-aqua">{Math.round(score * 100)}%</div><div className="text-xs text-mist">match</div></div>}</div>
      <p className="text-sm text-mist line-clamp-2">{job.description}</p>
      <div className="flex flex-wrap gap-1.5">{(job.skills ?? []).slice(0, 5).map((s: string) => <span key={s} className="text-xs px-2 py-1 rounded-full bg-ink border border-edge">{s}</span>)}</div>
      {focused && <div className="job-focus-details"><p className="job-focus-label">Role details</p><p className="job-detail-description">{job.description || "The employer has not added a full description yet."}</p><div className="grid grid-cols-2 gap-3 mt-3 text-xs"><div className="rounded-lg border border-edge bg-ink/60 p-3"><span className="text-mist block">Experience</span><strong className="block mt-1">{job.minExperience}+ years</strong></div><div className="rounded-lg border border-edge bg-ink/60 p-3"><span className="text-mist block">Work level</span><strong className="block mt-1">{job.level}</strong></div><div className="rounded-lg border border-edge bg-ink/60 p-3"><span className="text-mist block">Role category</span><strong className="block mt-1">{job.role}</strong></div><div className="rounded-lg border border-edge bg-ink/60 p-3"><span className="text-mist block">Salary</span><strong className="block mt-1 text-saffron">{lpa(job.salary)}</strong></div></div><p className="text-xs text-mist mt-3">Tip: move your pointer away to return to the job grid.</p></div>}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2"><span className="font-semibold text-saffron">{lpa(job.salary)} <span className="text-mist font-normal text-xs">· {job.level} · {job.minExperience}+ yrs</span></span><div className="flex items-center gap-3"><button className="job-detail-toggle" type="button" onClick={() => setFocused(v => !v)}>{focused ? "Hide details" : "View details"}</button><button disabled={!isSignedIn || done || applying} className="btn disabled:opacity-50" onClick={handleApply}>{done ? "Applied ✓" : applying ? "Applying…" : isSignedIn ? "Apply ↗" : "Sign in to apply"}</button></div></div>
    </Tilt>
  </div>;
}
