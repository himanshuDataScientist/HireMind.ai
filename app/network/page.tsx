"use client";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
const COL: any = { person: "#3DD6D0", skill: "#FFB02E", company: "#B28DFF" };
export default function Network() {
  const g = useQuery(api.graph.network); const connect = useMutation(api.graph.connect); const [hot, setHot] = useState<string | null>(null);
  if (!g) return <p className="pt-10 text-mist">Loading graph…</p>;
  const W = 900, H = 640, cx = W / 2, cy = H / 2, ring: any = { person: 120, company: 215, skill: 290 };
  const pos: any = {}; (["person", "company", "skill"] as const).forEach(t => { const ns = g.nodes.filter((n: any) => n.type === t); ns.forEach((n: any, i: number) => { const a = (i / ns.length) * 2 * Math.PI + (t === "company" ? .4 : t === "skill" ? .15 : 0); pos[n.id] = [cx + ring[t] * Math.cos(a), cy + ring[t] * Math.sin(a) * .9]; }); });
  const nb = new Set<string>(); if (hot) g.edges.forEach((e: any) => { if (e.from === hot) nb.add(e.to); if (e.to === hot) nb.add(e.from); });
  return (<div className="pt-10"><h1 className="text-3xl font-bold mb-2">Your network graph</h1>
    <p className="text-mist mb-6 text-sm">People, skills and companies as nodes and relationships (HAS_SKILL, APPLIED_TO, KNOWS). Hover to trace links. Click a person to connect.</p>
    <div className="rounded-2xl bg-panel border border-edge overflow-hidden stage"><svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {g.edges.map((e: any, i: number) => { const a = pos[e.from], b = pos[e.to]; if (!a || !b) return null; const on = hot && (e.from === hot || e.to === hot);
        return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={e.rel === "KNOWS" || e.rel === "CONNECTED_TO" ? "#3DD6D0" : "#2A3358"} strokeWidth={on ? 2.5 : 1} opacity={hot && !on ? .15 : .8} />; })}
      {g.nodes.map((n: any) => { const p = pos[n.id]; if (!p) return null; const dim = hot && n.id !== hot && !nb.has(n.id);
        return <g key={n.id} transform={`translate(${p[0]},${p[1]})`} opacity={dim ? .2 : 1} style={{ cursor: n.type === "person" ? "pointer" : "default" }} onMouseEnter={() => setHot(n.id)} onMouseLeave={() => setHot(null)} onClick={() => n.type === "person" && connect({ to: n.id })}>
          <circle r={n.type === "person" ? 14 : 9} fill={COL[n.type]} stroke={n.me ? "#fff" : "none"} strokeWidth={3} /><text y={n.type === "person" ? 28 : 22} textAnchor="middle" fontSize="11" fill="#A9B3D6">{n.label}</text></g>; })}
    </svg></div>
    <div className="flex gap-5 mt-4 text-sm text-mist">{Object.keys(COL).map(k => <span key={k}><span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: COL[k] }} />{k}</span>)}</div></div>);
}
