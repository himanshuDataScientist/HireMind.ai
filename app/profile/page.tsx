"use client";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { LEVELS } from "@/lib/format";
export default function Profile() {
  const me = useQuery(api.users.me); const save = useMutation(api.users.save); const { user } = useUser();
  const [f, setF] = useState<any>({ name: "", headline: "", experience: 0, education: "", location: "", skills: "", preferredRole: "", minSalary: 800000, level: "Entry" }); const [ok, setOk] = useState(false);
  useEffect(() => { if (me) setF({ ...me, skills: me.skills.join(", ") }); else if (user) setF((p: any) => ({ ...p, name: p.name || user.fullName || "" })); }, [me, user]);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const submit = async () => { await save({ name: f.name, headline: f.headline, experience: +f.experience, education: f.education, location: f.location, skills: f.skills.split(",").map((s: string) => s.trim().toLowerCase()).filter(Boolean), preferredRole: f.preferredRole, minSalary: +f.minSalary, level: f.level }); setOk(true); setTimeout(() => setOk(false), 2000); };
  return (<div className="pt-10 max-w-2xl"><h1 className="text-3xl font-bold mb-6">Your profile</h1>
    <div className="grid grid-cols-2 gap-4">
      <label className="col-span-2">Name<input className="input" value={f.name} onChange={set("name")} /></label>
      <label className="col-span-2">Headline<input className="input" value={f.headline} onChange={set("headline")} /></label>
      <label>Years of experience<input type="number" className="input" value={f.experience} onChange={set("experience")} /></label>
      <label>Location<input className="input" value={f.location} onChange={set("location")} /></label>
      <label className="col-span-2">Education<input className="input" value={f.education} onChange={set("education")} /></label>
      <label className="col-span-2">Skills (comma separated)<input className="input" value={f.skills} onChange={set("skills")} placeholder="python, sql, react" /></label>
      <label>Preferred role<input className="input" value={f.preferredRole} onChange={set("preferredRole")} /></label>
      <label>Preferred level<select className="input" value={f.level} onChange={set("level")}>{LEVELS.map(l => <option key={l}>{l}</option>)}</select></label>
      <label className="col-span-2">Minimum salary (₹ per year)<input type="number" className="input" value={f.minSalary} onChange={set("minSalary")} /></label></div>
    <button className="btn mt-6" onClick={submit}>{ok ? "Saved" : "Save profile"}</button></div>);
}
