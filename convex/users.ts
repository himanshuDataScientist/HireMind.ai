import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("seeker"), v.literal("recruiter"), v.literal("admin")),
    headline: v.optional(v.string()),
    skills: v.array(v.string()),
    domain: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert("users", args);
  },
});

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique(),
});

export const updateSkills = mutation({
  args: { id: v.id("users"), skills: v.array(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { skills: args.skills });
  },
});
