import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("seeker"), v.literal("recruiter"), v.literal("admin")),
    headline: v.optional(v.string()),
    skills: v.array(v.string()),
    domain: v.optional(v.string()),
  }).index("by_email", ["email"]),

  jobs: defineTable({
    title: v.string(),
    company: v.string(),
    description: v.string(),
    domain: v.string(),
    requiredSkills: v.array(v.string()),
    postedBy: v.id("users"),
    // set once the Neo4j graph node/edges are confirmed written
    graphSynced: v.boolean(),
  }).index("by_domain", ["domain"]),

  applications: defineTable({
    jobId: v.id("jobs"),
    userId: v.id("users"),
    status: v.union(
      v.literal("applied"),
      v.literal("reviewing"),
      v.literal("rejected"),
      v.literal("offered")
    ),
  })
    .index("by_job", ["jobId"])
    .index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    jobId: v.id("jobs"),
    message: v.string(),
    read: v.boolean(),
  }).index("by_user", ["userId"]),
});
