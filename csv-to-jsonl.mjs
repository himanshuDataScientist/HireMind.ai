import fs from "fs";
import Papa from "papaparse";

// numeric fields per table; everything else stays a string
const tables = {
  skills:          { file: "skills.csv",                   num: ["skillId"] },
  jobs:            { file: "jobs.csv",                     num: ["jobId","companyId","salary","minimumExperience"] },
  users:           { file: "users.csv",                    num: ["userId","experience"] },
  userPreferences: { file: "userPreferences_100000.csv",   num: ["userId","minimumSalary"] },
  applications:    { file: "applications_100000_final.csv",num: ["applicationId","userId","jobId"] },
  jobSkills:       { file: "jobSkills.csv",                num: ["jobId","skillId"] },
  userSkills:      { file: "userSkills_100000.csv",        num: ["userId","skillId"] },
};

fs.mkdirSync("data/jsonl", { recursive: true });

for (const [name, { file, num }] of Object.entries(tables)) {
  if (!fs.existsSync(`data/${file}`)) { console.log(`skip ${name}: data/${file} not found`); continue; }
  const rows = Papa.parse(fs.readFileSync(`data/${file}`, "utf8"),
    { header: true, skipEmptyLines: true }).data;
  const out = fs.createWriteStream(`data/jsonl/${name}.jsonl`);
  for (const r of rows) {
    for (const k of num) r[k] = Number(r[k]);
    out.write(JSON.stringify(r) + "\n");
  }
  out.end();
  console.log(`${name}: ${rows.length} rows`);
}