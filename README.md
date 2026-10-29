# HireMind.ai

HireMind.ai is a Next.js + React + Clerk + Convex job-discovery app. This version refreshes the landing page, adds 3D-style CSS visuals, implements a one-second job-card focus interaction, and introduces an employer verification workflow.

## What's changed

- Premium responsive landing page with layered CSS 3D visuals, skill-match cards, how-it-works steps, and a testimonial carousel.
- Testimonials are explicitly labelled as fictional sample copy. Replace them with real candidate-approved reviews before launch.
- Job cards focus after a one-second hover, fade other cards, show expanded details, and restore on pointer leave. A manual details toggle supports touchscreens and keyboard navigation.
- Employer registration collects public and legal company names, website, business email, address, country, company type, and applicable registration identifier.
- New employer profiles start as `pending`; the Convex `postJob` mutation only permits approved employers to publish.
- Public job queries and application mutations exclude jobs from employer-owned companies that have not been approved.
- Reviewer page is available at `/company/review` and requires an authorized Clerk user ID.
- `.env.local` is deliberately excluded from this archive. Use your own local environment file.

## Setup

1. Install Node.js (use a version supported by Next.js 14) and npm.
2. Run `npm install`.
3. Copy `.env.local.example` to `.env.local` and fill in your own Clerk and Convex values.
4. Run `npx convex dev` in one terminal and `npm run dev` in another.
5. Run `npx convex dev` after schema/function changes so Convex deploys the updated schema and regenerates API types.

## Configure employer reviewers

In the Convex Dashboard, open **Settings → Environment Variables** and add:

`HIREMIND_REVIEWER_CLERK_IDS=clerk_user_id_1,clerk_user_id_2`

Use actual Clerk user IDs for trusted internal reviewers. Keep this value private. Only users on this allowlist can use the review queue and approve/reject/suspend company records. Visit `/company/review` while signed in as an allowlisted user.

## Verification caveat

The workflow collects company information and requires an authorized human review; it does not independently verify business-email ownership or query government registries automatically. Reviewers must check the submitted website and official registry/registration evidence before approving. Do not describe a company as verified until that review has occurred. A future production version should add a verified business-email challenge and private document upload/storage with strict access controls.

## Production checklist

- Configure Clerk's production keys and the Convex deployment URL in the deployment environment.
- Configure the Clerk JWT issuer domain in Convex.
- Set `HIREMIND_REVIEWER_CLERK_IDS` in Convex, not in client-side code.
- Replace sample testimonials with authentic, permissioned reviews.
- Add a private evidence-upload workflow and real business-email verification before relying on automated trust signals.
- Run `npx convex dev` and `npx tsc --noEmit`, then test sign-in, job applications, company approval, job publication, and reviewer permissions before deploying.
- Do not commit `.env.local`, Clerk secret keys, or any production credentials.
