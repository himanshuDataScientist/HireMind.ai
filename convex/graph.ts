import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// Neo4j-style property graph served from Convex. Mirror: neo4j/seed.cypher
export const network = query({ handler: async (ctx) => {
  const id = await ctx.auth.getUserIdentity();
  const profiles = await ctx.db.query("profiles").take(40);
  const companies = await ctx.db.query("companies").take(20);
  const apps = await ctx.db.query("applications").take(200);
  const conns = await ctx.db.query("connections").take(200);
  const nodes: any[] = [], edges: any[] = []; const skillSet = new Set<string>();
  profiles.forEach(p => { nodes.push({ id: p.clerkId, label: p.name, type: "person", me: p.clerkId === id?.subject }); p.skills.slice(0, 4).forEach(s => { skillSet.add(s); edges.push({ from: p.clerkId, to: "s:" + s, rel: "HAS_SKILL" }); }); });
  skillSet.forEach(s => nodes.push({ id: "s:" + s, label: s, type: "skill" }));
  companies.forEach(c => nodes.push({ id: String(c._id), label: c.name, type: "company" }));
  for (const a of apps) { const j = await ctx.db.get(a.jobId); if (j) edges.push({ from: a.clerkId, to: String(j.companyId), rel: "APPLIED_TO" }); }
  conns.forEach(c => edges.push({ from: c.from, to: c.to, rel: c.relation }));
  const ids = new Set(nodes.map(n => n.id));
  return { nodes, edges: edges.filter(e => ids.has(e.from) && ids.has(e.to)) };
}});
export const connect = mutation({ args: { to: v.string() }, handler: async (ctx, { to }) => {
  const id = await ctx.auth.getUserIdentity(); if (!id || id.subject === to) return;
  const all = await ctx.db.query("connections").collect();
  if (!all.some(c => c.from === id.subject && c.to === to)) await ctx.db.insert("connections", { from: id.subject, to, relation: "CONNECTED_TO" });
}});
