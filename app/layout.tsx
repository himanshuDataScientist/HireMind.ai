import "./globals.css";
import { Sora, Manrope } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import Nav from "@/components/Nav";
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
export const metadata = { title: "HireMind.ai — Find work that fits your future", description: "Skills-first job discovery, personalized recommendations, and a more focused way to find your next opportunity." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<ClerkProvider><html lang="en" className={`${sora.variable} ${manrope.variable}`}><body>
    <Providers><Nav /><main className="mx-auto max-w-6xl px-4 pb-24">{children}</main></Providers>
  </body></html></ClerkProvider>);
}
