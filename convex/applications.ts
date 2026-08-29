import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const apply = mutation({
  args: { jobId: v.id("jobs"), userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.insert("applications", { ...args, status: "applied" });
  },
});

export const byUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) =>
    ctx.db
      .query("applications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect(),
});

export const byJob = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) =>
    ctx.db
      .query("applications")
      .withIndex("by_job", (q) => q.eq("jobId", args.jobId))
      .collect(),
});
