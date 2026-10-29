import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const fixAppliedAt = mutation({
  args: {},
  handler: async (ctx) => {
    const apps = await ctx.db.query("applications").collect();
    let fixed = 0;

    for (const app of apps) {
      const appliedAt: unknown = app.appliedAt;

      if (typeof appliedAt === "string") {
        const timestamp = Date.parse(appliedAt);

        if (!Number.isFinite(timestamp)) {
          throw new Error(`Invalid appliedAt date in application ${app._id}`);
        }

        await ctx.db.patch(app._id, {
          appliedAt: timestamp,
        });
        fixed++;
      }
    }

    return { scanned: apps.length, fixed };
  },
});
