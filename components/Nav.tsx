import Link from "next/link";

export default function Nav() {
  return (
    <div className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <span className="dot" />
          CareerGraph
        </Link>
        <nav className="nav-links">
          <Link href="/">Jobs</Link>
          <Link href="/post-job">Post a job</Link>
          <Link href="/profile">Profile</Link>
        </nav>
      </div>
    </div>
  );
}
