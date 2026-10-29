/** Shared profile-to-job matching score. All components are normalized to [0, 1]. */
const tok = (s: string) => s.toLowerCase().split(/[^a-z0-9+#]+/).filter(Boolean);
const bag = (tokens: string[]) => {
  const counts = new Map<string, number>();
  tokens.forEach((word) => counts.set(word, (counts.get(word) ?? 0) + 1));
  return counts;
};
function cosineSimilarity(a: string[], b: string[]) {
  const A = bag(a), B = bag(b);
  let dot = 0, normA = 0, normB = 0;
  A.forEach((count, word) => { normA += count * count; dot += count * (B.get(word) ?? 0); });
  B.forEach((count) => { normB += count * count; });
  return normA && normB ? dot / Math.sqrt(normA * normB) : 0;
}

const LEVEL_ORDER = ["Intern", "Entry", "Mid", "Senior", "Lead", "Manager"];
const clamp = (n: number) => Math.max(0, Math.min(1, n));

export function scoreJobMatch(profile: any, job: any) {
  const skills = cosineSimilarity(profile.skills.flatMap(tok), job.skills.flatMap(tok));
  const title = cosineSimilarity(tok(profile.preferredRole), tok(`${job.title} ${job.role}`));
  const description = cosineSimilarity(
    tok(`${profile.headline} ${profile.skills.join(" ")} ${profile.education} ${profile.preferredRole}`),
    tok(`${job.title} ${job.role} ${job.description} ${job.skills.join(" ")}`),
  );

  const experienceFit = profile.experience >= job.minExperience
    ? 1
    : Math.exp(-0.5 * (job.minExperience - profile.experience));
  const salaryFit = profile.minSalary <= 0 || job.salary >= profile.minSalary
    ? 1
    : Math.exp(-2 * ((profile.minSalary - job.salary) / profile.minSalary));
  const numerical = clamp((experienceFit + salaryFit) / 2);

  const profileLevel = LEVEL_ORDER.indexOf(profile.level);
  const jobLevel = LEVEL_ORDER.indexOf(job.level);
  const seniority = profileLevel < 0 || jobLevel < 0
    ? (profile.level === job.level ? 1 : 0.5)
    : clamp(1 - Math.abs(profileLevel - jobLevel) * 0.2);

  const score = clamp(0.45 * skills + 0.20 * title + 0.20 * description + 0.10 * numerical + 0.05 * seniority);
  return {
    score,
    parts: { skills, title, description, numerical, seniority },
  };
}
