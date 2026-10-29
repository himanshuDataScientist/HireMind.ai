import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
export const apply = mutation({ args: { jobId: v.id("jobs") }, handler: async (ctx, { jobId }) => {
  const id = await ctx.auth.getUserIdentity(); if (!id) throw new Error("Sign in first");
  const job = await ctx.db.get(jobId); if (!job || job.status !== "open") throw new Error("This job is no longer available");
  const company = await ctx.db.get(job.companyId);
  if (!company || (company.ownerClerkId && company.verificationStatus !== "approved")) throw new Error("This company is not approved to receive applications");
  const dup = (await ctx.db.query("applications").withIndex("by_job", q => q.eq("jobId", jobId)).collect()).find(a => a.clerkId === id.subject);
  if (dup) return dup._id;
  return ctx.db.insert("applications", { jobId, clerkId: id.subject, status: "Applied", appliedAt: Date.now() });
}});
export const mine = query({ handler: async (ctx) => {
  const id = await ctx.auth.getUserIdentity(); if (!id) return [];
  const apps = await ctx.db.query("applications").withIndex("by_user", q => q.eq("clerkId", id.subject)).collect();
  return Promise.all(apps.map(async a => { const job = await ctx.db.get(a.jobId); return { ...a, job, company: job ? await ctx.db.get(job.companyId) : null }; }));
}});
