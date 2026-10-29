import { mutation } from "./_generated/server";
// Run once:  npx convex run seed:run
export const run = mutation({ handler: async (ctx) => {
  if ((await ctx.db.query("jobs").first())) return "already seeded";
  const C = [["Nimbus Analytics","Decision-intelligence for retail chains.",4.4,820],["Kestrel Labs","Applied ML research studio.",4.6,310],["Orbit Payments","Fintech rails for SMEs.",4.1,1500],["Verdant Health","Digital care for chronic conditions.",4.3,460],["Pixelforge","Design-led product engineering.",4.5,230],["Meridian Cloud","Managed cloud and DevOps.",4.0,980]];
  const cid: any[] = []; for (const c of C) cid.push(await ctx.db.insert("companies", { name: c[0] as string, about: c[1] as string, rating: c[2] as number, reviews: c[3] as number }));
  const J: [string,string,string,number,number,string,string[],string,number][] = [
   ["Data Scientist","Data / AI","Senior",1500000,3,"Bengaluru",["python","machine learning","sql","statistics","pandas"],"Build forecasting and recommendation models on retail data.",1],
   ["Machine Learning Engineer","Data / AI","Mid",1200000,2,"Hyderabad",["python","tensorflow","docker","machine learning","aws"],"Productionise NLP and ranking models.",2],
   ["Data Analyst","Analyst","Entry",800000,1,"Mumbai",["sql","excel","power bi","python","data analysis"],"Own dashboards and ad-hoc analysis for finance teams.",3],
   ["Full Stack Developer","Developer","Mid",1400000,3,"Pune",["react","node.js","typescript","mongodb","aws"],"Ship payment dashboards used by thousands of merchants.",3],
   ["Frontend Engineer","Developer","Mid",1300000,2,"Remote",["react","typescript","tailwind","next.js","css"],"Craft fast, accessible interfaces.",5],
   ["DevOps Engineer","DevOps / Cloud","Senior",1800000,4,"Bengaluru",["aws","kubernetes","terraform","docker","linux"],"Run multi-region infrastructure.",6],
   ["Cloud Architect","DevOps / Cloud","Lead",2500000,7,"Gurugram",["azure","aws","terraform","networking","security"],"Design reference architectures for enterprise clients.",6],
   ["Product Manager","Management","Senior",2200000,5,"Bengaluru",["roadmapping","sql","communication","analytics","agile"],"Lead the care-journey product line.",4],
   ["UI/UX Designer","Designer / Creative","Mid",1000000,2,"Mumbai",["figma","ux research","prototyping","design systems"],"Design end-to-end flows for web and mobile.",5],
   ["QA Automation Engineer","Quality Assurance","Mid",900000,2,"Chennai",["selenium","python","testing","ci/cd","api testing"],"Automate regression suites.",3],
   ["Backend Engineer","Developer","Senior",2000000,4,"Bengaluru",["java","spring","postgresql","microservices","kafka"],"Scale ledger services.",3],
   ["Data Engineer","Data / AI","Mid",1400000,3,"Hyderabad",["python","spark","airflow","sql","aws"],"Build batch and streaming pipelines.",1],
   ["Software Intern","Intern / Trainee","Intern",300000,0,"Remote",["python","javascript","git","problem solving"],"Six-month internship with mentoring.",2],
   ["Research Scientist","Research","Lead",2800000,6,"Bengaluru",["deep learning","pytorch","nlp","research","python"],"Lead applied research on language models.",2]];
  const jid: any[] = []; for (const j of J) jid.push(await ctx.db.insert("jobs", { title: j[0], role: j[1], level: j[2], salary: j[3], minExperience: j[4], location: j[5], skills: j[6], description: j[7], companyId: cid[j[8]-1+0 > 5 ? 5 : j[8]-1], status: "open", postedAt: Date.now() - Math.random()*20*864e5 }));
  const P: [string,string,string,number,string,string[],string,number,string][] = [
   ["Aarav Mehta","Data scientist who loves forecasting","Mumbai",3,"B.Tech CSE, IIT Bombay",["python","machine learning","sql","pandas","statistics"],"Data Scientist",1400000,"Senior"],
   ["Diya Sharma","Full-stack builder","Pune",2,"B.E. IT, COEP",["react","node.js","typescript","mongodb"],"Full Stack Developer",1200000,"Mid"],
   ["Rohan Iyer","Cloud and infra","Bengaluru",5,"B.Tech ECE, NIT Trichy",["aws","kubernetes","terraform","docker"],"DevOps Engineer",1800000,"Senior"],
   ["Sneha Kulkarni","Analytics for fintech","Mumbai",1,"M.Sc Statistics, DU",["sql","excel","power bi","python"],"Data Analyst",800000,"Entry"],
   ["Kabir Singh","NLP researcher","Delhi",4,"M.Tech AI, IIT Delhi",["pytorch","nlp","deep learning","python"],"Research Scientist",2200000,"Lead"],
   ["Meera Nair","Product thinker","Bengaluru",6,"MBA, IIM Bangalore",["roadmapping","analytics","agile","sql"],"Product Manager",2200000,"Senior"],
   ["Ishaan Gupta","Frontend craftsperson","Remote",3,"B.Tech CSE, NIT Warangal",["react","typescript","tailwind","next.js"],"Frontend Engineer",1300000,"Mid"],
   ["Tanvi Rao","Designer","Mumbai",2,"B.Des, NID",["figma","ux research","prototyping"],"UI/UX Designer",1000000,"Mid"]];
  const ids: string[] = [];
  P.forEach((p,i)=>ids.push("demo_"+(i+1)));
  for (let i=0;i<P.length;i++){const p=P[i]; await ctx.db.insert("profiles",{clerkId:ids[i],name:p[0],headline:p[1],location:p[2],experience:p[3],education:p[4],skills:p[5],preferredRole:p[6],minSalary:p[7],level:p[8]});}
  const st=["Applied","Under Review","Shortlisted","Selected","Rejected"];
  for (let i=0;i<P.length;i++) for (let k=0;k<2;k++) await ctx.db.insert("applications",{jobId:jid[(i*2+k*5)%jid.length],clerkId:ids[i],status:st[(i+k)%5],appliedAt:Date.now()-(i+k)*864e5*3});
  const rel=[[0,1],[0,4],[1,6],[2,5],[3,0],[4,0],[5,6],[6,7],[2,1],[7,5]];
  for (const [a,b] of rel) await ctx.db.insert("connections",{from:ids[a],to:ids[b],relation:"KNOWS"});
  return "seeded";
}});
