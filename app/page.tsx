"use client";
import Link from "next/link";
import { useState } from "react";

const demo = [
  { title: "Machine Learning Engineer", company: "Northstar AI", salary: "₹18–24 LPA", match: "96%", skills: ["Python", "PyTorch", "LLMs"], color: "cyan" },
  { title: "Data Scientist", company: "Orbit Analytics", salary: "₹14–20 LPA", match: "92%", skills: ["SQL", "Statistics", "ML"], color: "violet" },
  { title: "Product Data Analyst", company: "Mosaic Labs", salary: "₹9–14 LPA", match: "89%", skills: ["SQL", "Python", "Power BI"], color: "amber" },
];
const testimonials = [
  { quote: "My family stopped forwarding me random job links. HireMind finally understood what I actually do.", name: "The very relieved candidate", role: "Demo testimonial · replace with a real review" },
  { quote: "I updated my profile at 1 AM. For once, the recommendations made more sense than my sleep schedule.", name: "The midnight applicant", role: "Demo testimonial · replace with a real review" },
  { quote: "Found a role that matched my skills. Now my biggest interview question is what to wear.", name: "The almost-ready professional", role: "Demo testimonial · replace with a real review" },
];
export default function Home() {
  const [review, setReview] = useState(0);
  return <div className="landing">
    <section className="hero-grid pt-14 md:pt-24 pb-16 md:pb-24">
      <div className="hero-copy relative z-10">
        <div className="eyebrow"><span className="pulse-dot" /> AI-powered job discovery <span className="eyebrow-divider" /> Built around you</div>
        <h1 className="hero-title mt-6">Your next move should feel <span className="gradient-text">like a match.</span></h1>
        <p className="hero-description mt-6">Less scrolling. More signal. HireMind connects your skills, experience and goals with opportunities that make sense for your career.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/recommended" className="btn hero-primary">Explore my matches <span aria-hidden="true">↗</span></Link><Link href="/jobs" className="btn-ghost hero-secondary">Browse all jobs</Link></div>
        <div className="hero-proof mt-8"><div className="proof-avatars"><span>H</span><span>M</span><span>A</span></div><p><strong>Built for your next chapter.</strong><br/><span>Skills-first discovery, not guesswork.</span></p></div>
      </div>
      <div className="hero-visual stage" aria-label="Decorative 3D illustration of personalized job matches">
        <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/>
        <div className="hero-core"><div className="core-inner"><span className="core-spark">✳</span><span className="core-word">HM</span><span className="core-caption">CAREER INTELLIGENCE</span></div></div>
        <div className="float-chip chip-top"><span className="chip-icon cyan-icon">✦</span><span><b>Skills-first matching</b><small>Fit beyond keywords</small></span></div>
        <div className="float-chip chip-bottom"><span className="chip-icon amber-icon">↗</span><span><b>Your next opportunity</b><small>Closer than you think</small></span></div>
        <div className="match-float"><div className="match-head"><span className="match-label">TOP MATCH</span><span className="match-percent">96%</span></div><div className="match-role">Machine Learning Engineer</div><div className="match-company">Northstar AI · Remote</div><div className="match-line"><i/></div><div className="match-foot"><span>Python</span><span>PyTorch</span><span>LLMs</span></div></div>
        <div className="visual-star star-a">✦</div><div className="visual-star star-b">✧</div><div className="visual-dot dot-a"/><div className="visual-dot dot-b"/>
      </div>
    </section>

    <section className="value-strip" aria-label="HireMind benefits"><div><span className="value-icon">◎</span><span><b>Skills-aware matching</b><small>Go beyond job-title keywords</small></span></div><div><span className="value-icon">⌘</span><span><b>One focused search</b><small>Find relevant roles faster</small></span></div><div><span className="value-icon">↗</span><span><b>Career momentum</b><small>Make your next move count</small></span></div></section>

    <section className="section-block pt-20 md:pt-28">
      <div className="section-heading"><div><p className="section-kicker">A BETTER WAY TO SEARCH</p><h2 className="section-title">Meet the roles that <span className="gradient-text">meet you halfway.</span></h2></div><Link href="/jobs" className="text-link">Explore jobs <span>↗</span></Link></div>
      <p className="section-intro">A little more context. A little less noise. Explore sample roles below—the live job feed comes from your HireMind database.</p>
      <div className="job-grid sample-job-grid">{demo.map((job, i) => <article className={`sample-job-card sample-${job.color}`} key={job.title} style={{ animationDelay: `${i * 100}ms` }}><div className="sample-card-top"><span className="company-mark">{job.company.slice(0,1)}</span><span className="sample-match">{job.match} fit</span></div><p className="sample-company">{job.company}</p><h3>{job.title}</h3><p className="sample-salary">{job.salary}</p><div className="sample-skills">{job.skills.map(s => <span key={s}>{s}</span>)}</div><Link href="/jobs" className="sample-card-link">Explore similar roles <span>→</span></Link></article>)}</div>
      <p className="demo-note">Illustrative cards for the landing page—not live vacancies or verified employers.</p>
    </section>

    <section className="how-section section-block pt-20 md:pt-28"><div className="section-heading"><div><p className="section-kicker">YOUR SEARCH, REFRAMED</p><h2 className="section-title">From “where do I start?”<br/><span className="gradient-text">to “this could be it.”</span></h2></div></div><div className="steps-grid"><div className="step-card"><span className="step-number">01</span><div className="step-symbol">⌘</div><h3>Bring your skills</h3><p>Add the tools you know, your experience and the work you want to do next.</p></div><div className="step-card"><span className="step-number">02</span><div className="step-symbol">✳</div><h3>See your fit</h3><p>Explore recommendations that consider skills, role, description and experience.</p></div><div className="step-card"><span className="step-number">03</span><div className="step-symbol">↗</div><h3>Make your move</h3><p>Compare opportunities, understand the role and apply when it feels right.</p></div></div></section>

    <section className="testimonial-section section-block pt-20 md:pt-28"><div className="testimonial-panel"><div className="testimonial-glow"/><div className="testimonial-left"><p className="section-kicker">A LITTLE CAREER HUMOUR</p><h2 className="section-title">The job hunt is serious.<br/><span className="gradient-text">You don’t have to be.</span></h2><p className="section-intro">A few fictional examples of the kind of happy messages we hope to earn from real candidates.</p><div className="testimonial-controls"><button aria-label="Previous sample testimonial" onClick={() => setReview((review + testimonials.length - 1) % testimonials.length)}>←</button><span>0{review + 1} <i>/</i> 0{testimonials.length}</span><button aria-label="Next sample testimonial" onClick={() => setReview((review + 1) % testimonials.length)}>→</button></div></div><article className="testimonial-card" key={review}><div className="quote-mark">“</div><p className="testimonial-quote">{testimonials[review].quote}</p><div className="testimonial-person"><div className="testimonial-avatar">{testimonials[review].name.slice(0,1)}</div><div><b>{testimonials[review].name}</b><small>{testimonials[review].role}</small></div></div><div className="testimonial-stars">✦ ✦ ✦ ✦ ✦ <span>sample story</span></div></article></div></section>

    <section className="final-cta section-block py-20 md:py-28"><div className="cta-orb"/><p className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</p><h2 className="section-title">Let’s find work that <span className="gradient-text">fits your future.</span></h2><p className="section-intro">Build your profile, explore relevant roles and take the next step with more confidence.</p><div className="mt-7 flex justify-center flex-wrap gap-3"><Link href="/profile" className="btn hero-primary">Build my profile ↗</Link><Link href="/company" className="btn-ghost hero-secondary">I’m hiring</Link></div></section>
  </div>;
}
