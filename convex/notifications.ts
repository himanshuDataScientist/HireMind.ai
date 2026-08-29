import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Called by the backend sync route after Neo4j identifies which users
// match a newly posted job's required skills / domain.
export const createForMatches = mutation({
  args: {
    jobId: v.id("jobs"),
    userIds: v.array(v.id("users")),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    for (const userId of args.userIds) {
      await ctx.db.insert("notifications", {
        userId,
        jobId: args.jobId,
        message: args.message,
        read: false,
      });
    }
  },
});

export const byUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) =>
    ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect(),
});

export const markRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});
