import { query } from "./_generated/server";
// Content-based scoring mirroring the ML spec: 0.5 skills + 0.2 title + 0.2 description + 0.1 numeric.
// Production: swap this for a call to the Python TF-IDF service (see README).
const tok = (s: string) => s.toLowerCase().split(/[^a-z0-9+#]+/).filter(Boolean);
const bag = (t: string[]) => { const m = new Map<string, number>(); t.forEach(w => m.set(w, (m.get(w) ?? 0) + 1)); return m; };
function cos(a: string[], b: string[]) {
  const A = bag(a), B = bag(b); let dot = 0, na = 0, nb = 0;
  A.forEach((x, k) => { na += x * x; dot += x * (B.get(k) ?? 0); }); B.forEach(x => (nb += x * x));
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}
export const forMe = query({ handler: async (ctx) => {
  const id = await ctx.auth.getUserIdentity(); if (!id) return [];
  const p = await ctx.db.query("profiles").withIndex("by_clerk", q => q.eq("clerkId", id.subject)).unique(); if (!p) return [];
  const jobs = (await ctx.db.query("jobs").take(500)).filter(j => j.status === "open");
  const pSkills = p.skills.flatMap(tok), pTitle = tok(p.preferredRole), pDesc = tok(`${p.headline} ${p.skills.join(" ")} ${p.education}`);
  const rows = [];
  for (const j of jobs) {
    const s = cos(pSkills, j.skills.flatMap(tok)), t = cos(pTitle, tok(j.title + " " + j.role)), d = cos(pDesc, tok(j.description));
    const exp = p.experience >= j.minExperience ? 1 : Math.exp(-0.5 * (j.minExperience - p.experience));
    const sal = j.salary >= p.minSalary ? 1 : Math.exp(-2 * ((p.minSalary - j.salary) / p.minSalary));
    const lvl = j.level === p.level ? 1 : 0.4;
    const score = 0.5 * s + 0.2 * t + 0.2 * d + 0.1 * ((exp + sal) / 2) ;
    rows.push({ job: j, company: await ctx.db.get(j.companyId), score: Math.min(0.99, score * 0.9 + 0.1 * lvl * (s > 0 ? 1 : 0)), parts: { skills: s, title: t, description: d, numeric: (exp + sal) / 2 } });
  }
  return rows.sort((a, b) => b.score - a.score).slice(0, 12);
}});
