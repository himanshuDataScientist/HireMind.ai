import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  profiles: defineTable({ clerkId: v.string(), name: v.string(), headline: v.string(), experience: v.number(), education: v.string(), location: v.string(), skills: v.array(v.string()), preferredRole: v.string(), minSalary: v.number(), level: v.string() }).index("by_clerk", ["clerkId"]),
  companies: defineTable({
    name: v.string(), about: v.string(), rating: v.optional(v.number()), reviews: v.optional(v.number()), ownerClerkId: v.optional(v.string()),
    legalName: v.optional(v.string()), website: v.optional(v.string()), businessEmail: v.optional(v.string()), contactName: v.optional(v.string()), contactPhone: v.optional(v.string()), gstNumber: v.optional(v.string()), registeredAddress: v.optional(v.string()), country: v.optional(v.string()), companyType: v.optional(v.string()), registrationNumber: v.optional(v.string()),
    verificationStatus: v.optional(v.string()), verificationSubmittedAt: v.optional(v.number()), reviewedAt: v.optional(v.number()), reviewedBy: v.optional(v.string()), rejectionReason: v.optional(v.string())
  }).index("by_owner", ["ownerClerkId"]).index("by_verification_status", ["verificationStatus"]),
  jobs: defineTable({ title: v.string(), role: v.string(), level: v.string(), companyId: v.id("companies"), salary: v.number(), minExperience: v.number(), location: v.string(), skills: v.array(v.string()), description: v.string(), status: v.string(), postedAt: v.number() }).index("by_company", ["companyId"]),
  applications: defineTable({ jobId: v.id("jobs"), clerkId: v.string(), status: v.string(), appliedAt: v.union(v.number(), v.string()) }).index("by_user", ["clerkId"]).index("by_job", ["jobId"]),
  connections: defineTable({ from: v.string(), to: v.string(), relation: v.string() }),
});
