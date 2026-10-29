import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

async function identity(ctx: any) { return await ctx.auth.getUserIdentity(); }
async function owned(ctx: any) {
  const id = await identity(ctx); if (!id) return null;
  return ctx.db.query("companies").withIndex("by_owner", (q: any) => q.eq("ownerClerkId", id.subject)).first();
}
function isReviewer(subject: string) {
  const allowlist = (process.env.HIREMIND_REVIEWER_CLERK_IDS ?? "").split(",").map((x) => x.trim()).filter(Boolean);
  return allowlist.includes(subject);
}
export const mine = query({ handler: async (ctx) => owned(ctx) });

export const create = mutation({
  args: { name: v.string(), about: v.string(), legalName: v.string(), website: v.string(), businessEmail: v.string(), contactName: v.string(), contactPhone: v.string(), gstNumber: v.string(), registeredAddress: v.string(), country: v.string(), companyType: v.string(), registrationNumber: v.string() },
  handler: async (ctx, a) => {
    const id = await identity(ctx); if (!id) throw new Error("Sign in first to register as an employer");
    const existing = await ctx.db.query("companies").withIndex("by_owner", (q) => q.eq("ownerClerkId", id.subject)).first();
    if (existing) throw new Error("An employer profile already exists for this account");
    const name = a.name.trim(), legalName = a.legalName.trim(), email = a.businessEmail.trim().toLowerCase(), website = a.website.trim(), address = a.registeredAddress.trim(), contactName = a.contactName.trim(), contactPhone = a.contactPhone.trim(), gstNumber = a.gstNumber.trim().toUpperCase();
    if (name.length < 2 || legalName.length < 2 || a.about.trim().length < 20) throw new Error("Add a company name, legal name, and a description of at least 20 characters");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid business email address");
    if (!/^https:\/\//i.test(website)) throw new Error("Enter your company website starting with https://");
    if (address.length < 8) throw new Error("Enter the registered business address");
    if (contactName.length < 2) throw new Error("Enter the company contact person’s name");
    if (!/^\+?[0-9()\s-]{8,20}$/.test(contactPhone)) throw new Error("Enter a valid company contact phone number");
    if (a.country.trim().toLowerCase() === "india" && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstNumber)) throw new Error("Enter a valid 15-character Indian GSTIN");
    if (a.country.trim().toLowerCase() !== "india" && gstNumber.length < 3) throw new Error("Enter your country’s tax or business registration number");
    
    return ctx.db.insert("companies", {
      name, about: a.about.trim(), legalName, website, businessEmail: email, contactName, contactPhone, gstNumber, registeredAddress: address,
      country: a.country.trim(), companyType: a.companyType.trim(), registrationNumber: a.registrationNumber.trim(),
      verificationStatus: "pending", verificationSubmittedAt: Date.now(), ownerClerkId: id.subject, reviews: 0
    });
  }
});

export const completeRegistration = mutation({
  args: { businessEmail: v.string(), contactName: v.string(), contactPhone: v.string(), gstNumber: v.string(), registrationNumber: v.string() },
  handler: async (ctx, a) => {
    const id = await identity(ctx); const c = await owned(ctx);
    if (!id || !c || c.ownerClerkId !== id.subject) throw new Error("Company profile not found");
    if (c.verificationStatus && c.verificationStatus !== "pending") throw new Error("Only pending company registrations can be updated here");
    const businessEmail = a.businessEmail.trim().toLowerCase();
    const contactName = a.contactName.trim(); const contactPhone = a.contactPhone.trim(); const gstNumber = a.gstNumber.trim().toUpperCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) throw new Error("Enter a valid business email address");
    if (contactName.length < 2) throw new Error("Enter the company contact person's name");
    if (!/^\+?[0-9()\s-]{8,20}$/.test(contactPhone)) throw new Error("Enter a valid company contact phone number");
    if ((c.country ?? "India").toLowerCase() === "india" && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstNumber)) throw new Error("Enter a valid 15-character Indian GSTIN");
    if (gstNumber.length < 3) throw new Error("Enter your GST/tax ID");
    await ctx.db.patch(c._id, { businessEmail, contactName, contactPhone, gstNumber, registrationNumber: a.registrationNumber.trim(), verificationStatus: "pending", verificationSubmittedAt: Date.now() });
    return c._id;
  }
});

export const resubmit = mutation({
  args: { name: v.string(), about: v.string(), legalName: v.string(), website: v.string(), businessEmail: v.string(), contactName: v.string(), contactPhone: v.string(), gstNumber: v.string(), registeredAddress: v.string(), country: v.string(), companyType: v.string(), registrationNumber: v.string() },
  handler: async (ctx, a) => {
    const id = await identity(ctx); const c = await owned(ctx);
    if (!id || !c || c.ownerClerkId !== id.subject) throw new Error("Company profile not found");
    if (c.verificationStatus !== "rejected") throw new Error("Only rejected applications can be resubmitted");
    const email = a.businessEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^https:\/\//i.test(a.website.trim())) throw new Error("Enter a valid business email and HTTPS company website");
    if (a.contactName.trim().length < 2 || !/^\+?[0-9()\s-]{8,20}$/.test(a.contactPhone.trim())) throw new Error("Enter a contact person and valid company phone number");
    const gstNumber = a.gstNumber.trim().toUpperCase();
    if (a.country.trim().toLowerCase() === "india" && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gstNumber)) throw new Error("Enter a valid 15-character Indian GSTIN");
    if (a.name.trim().length < 2 || a.legalName.trim().length < 2 || a.about.trim().length < 20 || a.registeredAddress.trim().length < 8) throw new Error("Complete all required company details before resubmitting");
    await ctx.db.patch(c._id, { ...a, name: a.name.trim(), legalName: a.legalName.trim(), website: a.website.trim(), businessEmail: email, registeredAddress: a.registeredAddress.trim(), country: a.country.trim(), companyType: a.companyType.trim(), registrationNumber: a.registrationNumber.trim(), contactName: a.contactName.trim(), contactPhone: a.contactPhone.trim(), gstNumber, verificationStatus: "pending", verificationSubmittedAt: Date.now(), reviewedAt: undefined, reviewedBy: undefined, rejectionReason: undefined });
    return c._id;
  }
});

export const review = mutation({
  args: { companyId: v.id("companies"), status: v.union(v.literal("approved"), v.literal("rejected"), v.literal("suspended")), rejectionReason: v.optional(v.string()) },
  handler: async (ctx, a) => {
    const id = await identity(ctx); if (!id || !isReviewer(id.subject)) throw new Error("Only an authorized HireMind reviewer can review companies. Configure HIREMIND_REVIEWER_CLERK_IDS in Convex environment variables.");
    const c = await ctx.db.get(a.companyId); if (!c) throw new Error("Company not found");
    if (a.status === "rejected" && (a.rejectionReason ?? "").trim().length < 5) throw new Error("Add a clear rejection reason");
    await ctx.db.patch(c._id, { verificationStatus: a.status, reviewedAt: Date.now(), reviewedBy: id.subject, rejectionReason: a.status === "rejected" ? a.rejectionReason?.trim() : undefined });
    if (a.status === "approved") {
      const pendingJobs = await ctx.db.query("jobs").withIndex("by_company", q => q.eq("companyId", c._id)).collect();
      for (const job of pendingJobs) if (job.status === "pending_review") await ctx.db.patch(job._id, { status: "open" });
    }
    return c._id;
  }
});

export const reviewQueue = query({ handler: async (ctx) => {
  const id = await identity(ctx); if (!id || !isReviewer(id.subject)) throw new Error("Reviewer access required");
  const companies = await ctx.db.query("companies").withIndex("by_verification_status", q => q.eq("verificationStatus", "pending")).collect();
  return companies;
}});

export const postJob = mutation({ args: { title: v.string(), role: v.string(), level: v.string(), salary: v.number(), minExperience: v.number(), location: v.string(), skills: v.array(v.string()), description: v.string() },
  handler: async (ctx, a) => {
    const c = await owned(ctx); if (!c) throw new Error("Register your company first");
    if (!c.businessEmail || !c.contactPhone || !c.contactName || !c.gstNumber) throw new Error("Complete your company contact details and GST/tax registration before posting jobs");
    if (c.verificationStatus === "rejected" || c.verificationStatus === "suspended") throw new Error("Your company registration is not active. Update your details or contact HireMind support.");
    if (a.title.trim().length < 3 || a.description.trim().length < 30 || a.skills.length === 0 || a.salary <= 0 || a.minExperience < 0) throw new Error("Complete the job title, description, skills, salary and experience fields");
    return ctx.db.insert("jobs", { ...a, title: a.title.trim(), description: a.description.trim(), companyId: c._id, status: c.verificationStatus === "approved" ? "open" : "pending_review", postedAt: Date.now() });
  }});

export const myJobs = query({ handler: async (ctx) => {
  const c = await owned(ctx); if (!c) return [];
  const jobs = await ctx.db.query("jobs").withIndex("by_company", q => q.eq("companyId", c._id)).collect();
  return Promise.all(jobs.map(async j => {
    const apps = await ctx.db.query("applications").withIndex("by_job", q => q.eq("jobId", j._id)).collect();
    const applicants = await Promise.all(apps.map(async a => ({ ...a, profile: await ctx.db.query("profiles").withIndex("by_clerk", q => q.eq("clerkId", a.clerkId)).unique() })));
    return { ...j, applicants };
  }));
}});
export const setJobStatus = mutation({ args: { jobId: v.id("jobs"), status: v.string() }, handler: async (ctx, { jobId, status }) => {
  const c = await owned(ctx); const j = await ctx.db.get(jobId); if (!c || !j || j.companyId !== c._id) throw new Error("Not allowed");
  if (!["open", "closed", "deleted"].includes(status)) throw new Error("Invalid job status");
  // Employers may delete their own pending draft, but only verified companies can publish/manage live listings.
  if (status === "deleted") { await ctx.db.delete(jobId); return; }
  if (c.verificationStatus !== "approved") throw new Error("Your company must be verified before managing live listings");
  await ctx.db.patch(jobId, { status });
}});
export const setApplicationStatus = mutation({ args: { applicationId: v.id("applications"), status: v.string() }, handler: async (ctx, { applicationId, status }) => {
  const c = await owned(ctx); const a = await ctx.db.get(applicationId); const j = a && await ctx.db.get(a.jobId);
  if (!c || !j || j.companyId !== c._id || c.verificationStatus !== "approved") throw new Error("Not allowed");
  if (!["Applied", "Under Review", "Shortlisted", "Selected", "Rejected"].includes(status)) throw new Error("Invalid application status");
  await ctx.db.patch(applicationId, { status });
}});
