# HireMind.ai — Isolated redesign workspace

This folder uses the source code from the `Random` project, arranged in the same `hiremind-ai` project structure.

## Important isolation notes

- The Clerk publishable key, Clerk secret key, and Clerk JWT issuer domain were copied from your existing HireMind.ai local environment as requested.
- `NEXT_PUBLIC_CONVEX_URL` is intentionally blank. Do **not** point this project at your existing Convex deployment if you want the database isolated.
- Because the same Clerk application credentials are reused, authentication belongs to the same Clerk application. For fully isolated auth users/settings, create a separate Clerk development application and replace those three Clerk values.
- `.env.local` contains a secret key. Do not commit it to Git or share this ZIP publicly. `.gitignore` excludes it.

## Setup safely

1. Open this folder in VS Code.
2. In the terminal, run `npm install`.
3. Run `npx convex dev` and create a **new Convex project/deployment** when prompted. Confirm the deployment/project name is new and not the existing production deployment. This should populate `NEXT_PUBLIC_CONVEX_URL` in `.env.local`.
4. In the new Convex deployment dashboard, add `CLERK_JWT_ISSUER_DOMAIN` using the issuer domain already in `.env.local`.
5. In the new Convex deployment, set `HIREMIND_REVIEWER_CLERK_IDS` to the authorized reviewer Clerk user ID(s), comma-separated.
6. In a second terminal, run `npm run dev` and open `http://localhost:3000`.

Do not run `npx convex deploy` against the old deployment. Verify the selected Convex deployment before running backend commands.
