import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    description: v.string(),
    domain: v.string(),
    requiredSkills: v.array(v.string()),
    postedBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("jobs", { ...args, graphSynced: false });
    return jobId;
  },
});

export const markGraphSynced = mutation({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { graphSynced: true });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("jobs").order("desc").collect();
  },
});

export const get = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const byDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("jobs")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .collect(),
});
