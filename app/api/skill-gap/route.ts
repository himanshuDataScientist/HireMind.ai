import { NextRequest, NextResponse } from "next/server";

// POST body: { userSkills: string[], requiredSkills: string[] }
//
// NOTE: this is a straightforward set-difference heuristic, not a trained
// model. It's wired up as its own service boundary (a plain HTTP endpoint)
// specifically so it can be swapped for a real scikit-learn/embeddings-based
// classifier later (e.g. a Python FastAPI service) without touching any
// caller — see README "Swapping in real ML" section.
export async function POST(req: NextRequest) {
  const { userSkills = [], requiredSkills = [] } = await req.json();

  const have = new Set(userSkills.map((s: string) => s.toLowerCase().trim()));
  const missing = requiredSkills.filter((s: string) => !have.has(s.toLowerCase().trim()));
  const matched = requiredSkills.filter((s: string) => have.has(s.toLowerCase().trim()));

  const score = requiredSkills.length === 0 ? 1 : matched.length / requiredSkills.length;

  return NextResponse.json({
    matched,
    missing,
    readiness: Math.round(score * 100), // % of required skills already held
  });
}
