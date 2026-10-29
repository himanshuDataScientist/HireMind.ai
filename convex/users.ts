import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
export const me = query({ handler: async (ctx) => {
  const id = await ctx.auth.getUserIdentity(); if (!id) return null;
  return ctx.db.query("profiles").withIndex("by_clerk", q => q.eq("clerkId", id.subject)).unique();
}});
export const save = mutation({
  args: { name: v.string(), headline: v.string(), experience: v.number(), education: v.string(), location: v.string(), skills: v.array(v.string()), preferredRole: v.string(), minSalary: v.number(), level: v.string() },
  handler: async (ctx, a) => {
    const id = await ctx.auth.getUserIdentity(); if (!id) throw new Error("Sign in first");
    const ex = await ctx.db.query("profiles").withIndex("by_clerk", q => q.eq("clerkId", id.subject)).unique();
    if (ex) await ctx.db.patch(ex._id, a); else await ctx.db.insert("profiles", { clerkId: id.subject, ...a });
  }});
