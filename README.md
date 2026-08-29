# CareerGraph

An intelligent recruitment platform: job matching, skill-gap analysis, and
graph-based professional networking, built on two purpose-fit databases
instead of forcing one to do both jobs.

- **Convex** — the application's source of truth: users, jobs, applications, notifications.
- **Neo4j** — the relationship layer: skills, connections, career paths, domain clusters.
- **Next.js (App Router)** — frontend + the backend API routes that keep the two in sync.

```
React/Next.js  →  Convex (app data)  →  API route  →  Neo4j (graph)
                                              ↓
                                     graph match query
                                              ↓
                                    Convex notifications
```

## Why two databases

Convex is great at reactive application state — profiles, job posts,
applications, notifications. It is not built for multi-hop relationship
queries like "find people two connections away who share three of these
five skills." Neo4j is built for exactly that. The two are kept
consistent by writing to Convex first (it's the source of truth), then
mirroring only the graph-relevant fields into Neo4j through a server-only
API route — see `app/api/sync-graph/route.ts` and `app/api/sync-user/route.ts`.

If a sync call fails, the Convex record still exists (`job.graphSynced`
stays `false`); it just won't show up in matching until re-synced. That
tradeoff — and a more robust retry/queue approach for production — is
called out inline in the code.

## Project layout

```
app/
  page.tsx                 home: hero + job listings
  post-job/page.tsx         create a job → Convex → sync to Neo4j → notify matches
  jobs/[id]/page.tsx        job detail, skill-gap check, graph matches
  profile/page.tsx          user profile + skills → synced to Neo4j
  api/
    sync-graph/route.ts     Convex job → Neo4j Job/Skill/Domain nodes
    sync-user/route.ts      Convex user → Neo4j User/Skill nodes
    graph-match/route.ts    Cypher query: users ranked by skill overlap with a job
    skill-gap/route.ts      set-difference heuristic (placeholder for real ML)
convex/
  schema.ts                 users, jobs, applications, notifications tables
  users.ts / jobs.ts / applications.ts / notifications.ts
lib/neo4j.ts                 server-only Neo4j driver singleton
components/                  Nav, GraphHero, ConvexClientProvider
```

## Setup

**Prerequisites:** Node 18+, a free [Convex](https://convex.dev) account, a free [Neo4j AuraDB](https://console.neo4j.io) instance.

```bash
npm install

# Starts Convex, logs you in on first run, writes convex/_generated/*
# and prints your NEXT_PUBLIC_CONVEX_URL — keep this running in one terminal.
npx convex dev

# In a second terminal:
cp .env.example .env.local
# paste the Convex URL it printed, and your Neo4j Aura credentials

npm run dev
```

Visit `http://localhost:3000`, go to **Profile** to set your skills, then
**Post a job** — it'll save to Convex, sync to Neo4j, and (once you have
more than one profile with overlapping skills) generate match
notifications.

## Swapping in real ML

`app/api/skill-gap/route.ts` currently does a plain set-difference
between a user's skills and a job's required skills — it's intentionally
isolated behind its own HTTP endpoint so it's a drop-in swap: replace the
handler's body with a call to a trained classifier (e.g. a small Python
FastAPI service doing embedding similarity or a scikit-learn model over
historical hires) without changing any caller. The original conversation
this project is based on scoped this as a supervised-learning component;
this scaffold ships the interface and a working heuristic so the app is
usable immediately, and the model is a natural next milestone.

## Auth note

There's no real auth wired in — `post-job` and `profile` create/reuse a
fixed demo user by email so the flows work end-to-end. Swap in
Clerk/Auth.js/Convex Auth before using this beyond a demo; every place
that currently hardcodes a demo email or `"demo-seeker"` id is marked
with a comment.

## Deploying

### 1. Push to GitHub

```bash
cd careergraph
git init
git add .
git commit -m "Initial CareerGraph scaffold: Convex + Neo4j + Next.js"
git branch -M main
git remote add origin https://github.com/<your-username>/careergraph.git
git push -u origin main
```

(Create the empty repo on GitHub first — `gh repo create careergraph --public --source=. --push` does both steps at once if you have the GitHub CLI.)

### 2. Deploy Convex to production

```bash
npx convex deploy
```
Copy the production URL it prints.

### 3. Deploy to Vercel

Easiest path — via the dashboard:
1. [vercel.com/new](https://vercel.com/new) → import the GitHub repo.
2. Add environment variables: `NEXT_PUBLIC_CONVEX_URL` (production URL from step 2), `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`.
3. Deploy.

Or via CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```
It'll prompt for the same environment variables on first deploy.

## Roadmap (phases from the original scope)

1. **Core CRUD** (this scaffold) — users, jobs, applications, notifications; Convex↔Neo4j sync; heuristic skill-gap.
2. **Real auth** — replace demo users with Clerk/Convex Auth.
3. **Real ML** — swap the skill-gap heuristic for a trained model; add a recommendation endpoint using embeddings over job/user skill sets.
4. **Career-path & clustering queries** — Cypher queries for "similar career paths" and domain-cluster visualization (the graph is already shaped for this — see `HAS_SKILL`, `INTERESTED_IN`, `BELONGS_TO` edges).
5. **Sync robustness** — move Convex→Neo4j sync off the request path into a queue/webhook with retries, so a transient Neo4j outage can't leave data inconsistent.
