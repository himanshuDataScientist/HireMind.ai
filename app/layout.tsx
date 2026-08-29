import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import ConvexClientProvider from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
  title: "HireMind.ai",
  description: "Job matching, skill-gap analysis, and career-path discovery, built on a real graph.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          <Nav />
          <main>{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
