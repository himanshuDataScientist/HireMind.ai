import fs from "fs";
import Papa from "papaparse";

const rows = Papa.parse(fs.readFileSync("data/users_100000_complete.csv", "utf8"),
  { header: true, skipEmptyLines: true }).data;

fs.mkdirSync("data/jsonl", { recursive: true });

const out = fs.createWriteStream("data/jsonl/users.jsonl");
for (const u of rows) {
  out.write(JSON.stringify({
    userId: Number(u.userId),
    name: u.name,
    email: u.email,
    experience: Number(u.experience),
    education: u.education,
    preferredRole: u.preferredRole,
    minimumSalary: Number(u.minimumSalary),
    preferredJobLevel: u.preferredJobLevel,
  }) + "\n");
}
out.end();
console.log(`users: ${rows.length} rows`);