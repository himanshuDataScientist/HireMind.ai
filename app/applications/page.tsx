"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { STATUSES } from "@/lib/format";
export default function Apps() {
  const apps = useQuery(api.applications.mine);
  if (!apps) return <p className="pt-10 text-mist">Loading…</p>;
  return (<div className="pt-10"><h1 className="text-3xl font-bold mb-8">My applications</h1>
    {apps.length === 0 && <p className="text-mist">You haven't applied anywhere yet. Open Jobs and press Apply.</p>}
    <div className="space-y-4">{apps.map(a => { const idx = STATUSES.indexOf(a.status); const rej = a.status === "Rejected";
      return (<div key={a._id} className="rounded-2xl bg-panel border border-edge p-5"><div className="flex justify-between"><div><div className="font-semibold">{a.job?.title}</div><div className="text-sm text-mist">{a.company?.name} · {new Date(a.appliedAt).toLocaleDateString()}</div></div>
        <span className={`text-sm font-semibold ${rej ? "text-red-400" : "text-aqua"}`}>{a.status}</span></div>
        <div className="mt-4 flex gap-1">{STATUSES.slice(0, 4).map((s, i) => <div key={s} className="flex-1"><div className={`h-1.5 rounded ${!rej && i <= idx ? "bg-aqua" : "bg-edge"}`} /><div className="text-[11px] text-mist mt-1">{s}</div></div>)}</div></div>); })}</div></div>);
}
