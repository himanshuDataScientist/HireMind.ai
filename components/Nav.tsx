"use client";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
const links = [["/jobs", "Find jobs"], ["/recommended", "For you"], ["/applications", "Applications"], ["/network", "Network"], ["/profile", "Profile"], ["/company", "For employers"]];
export default function Nav() {
  return <header className="sticky top-0 z-40 border-b border-edge bg-ink/75 backdrop-blur-xl"><div className="mx-auto max-w-6xl px-4 min-h-16 flex items-center gap-5">
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="HireMind home"><span className="grid place-items-center w-8 h-8 rounded-xl border border-aqua/30 bg-aqua/10 text-aqua font-bold text-sm">H</span><span className="font-display font-bold text-lg tracking-tight">Hire<span className="text-saffron">Mind</span><span className="text-mist text-xs">.ai</span></span></Link>
    <nav className="hidden lg:flex items-center gap-5 text-xs text-mist">{links.map(([h, l]) => <Link key={h} href={h} className="transition-colors hover:text-white">{l}</Link>)}</nav>
    <div className="ml-auto flex items-center gap-3"><Link href="/jobs" className="hidden sm:inline text-xs text-mist hover:text-white">Explore jobs</Link><SignedOut><SignInButton mode="modal"><button className="btn !py-2 !px-4 text-xs">Sign in</button></SignInButton></SignedOut><SignedIn><UserButton afterSignOutUrl="/" /></SignedIn></div>
  </div><nav className="lg:hidden mx-auto max-w-6xl px-4 pb-3 flex gap-4 overflow-x-auto text-xs text-mist">{links.map(([h,l])=><Link key={h} href={h} className="whitespace-nowrap hover:text-white">{l}</Link>)}</nav></header>;
}
