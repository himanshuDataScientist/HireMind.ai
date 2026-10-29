import { query } from "./_generated/server";
import { v } from "convex/values";
import { scoreJobMatch } from "./_lib/matchScore";
function isPublicCompany(company: any) {
  // Unowned records are legacy demo/seed companies; every employer-owned company must be explicitly approved.
  return !!company && (!company.ownerClerkId || company.verificationStatus === "approved");
}
function publicCompany(company: any) {
  if (!company) return null;
  const { registrationNumber, businessEmail, contactName, contactPhone, gstNumber, registeredAddress, rejectionReason, reviewedBy, ownerClerkId, ...safe } = company;
  return { ...safe, isVerified: !ownerClerkId || company.verificationStatus === "approved" };
}
export const list = query({ args: { q: v.optional(v.string()), level: v.optional(v.string()), minSalary: v.optional(v.number()) },
  handler: async (ctx, { q, level, minSalary }) => {
    const identity = await ctx.auth.getUserIdentity();
    const profile = identity
      ? await ctx.db.query("profiles").withIndex("by_clerk", q => q.eq("clerkId", identity.subject)).unique()
      : null;
    const jobs = (await ctx.db.query("jobs").order("desc").take(300)).filter(j => j.status === "open");
    const out = [];
    for (const j of jobs) {
      const company = await ctx.db.get(j.companyId);
      if (!isPublicCompany(company)) continue;
      const hay = `${j.title} ${j.role} ${j.location} ${j.skills.join(" ")} ${company?.name}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) continue;
      if (level && j.level !== level) continue;
      if (minSalary && j.salary < minSalary) continue;
      const match = profile ? scoreJobMatch(profile, j) : null;
      out.push({ ...j, company: publicCompany(company), score: match?.score ?? null, parts: match?.parts ?? null });
    }
    return out;
  }});
export const get = query({ args: { id: v.id("jobs") }, handler: async (ctx, { id }) => {
  const j = await ctx.db.get(id); if (!j || j.status !== "open") return null;
  const company = await ctx.db.get(j.companyId); if (!isPublicCompany(company)) return null;
  return { ...j, company: publicCompany(company) };
}});
