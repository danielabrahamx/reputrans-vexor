import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vexor - ZK-Graded NPL Portfolio Intelligence",
  description:
    "AI-powered NPL portfolio grading with zero-knowledge proofs. TCPP-compliant case management, GDPR-first architecture, and automated debt collection workflows for European asset managers.",
  openGraph: {
    title: "Vexor - ZK-Graded NPL Portfolio Intelligence",
    description:
      "AI-powered NPL portfolio grading with zero-knowledge proofs. TCPP-compliant case management, GDPR-first architecture, and automated debt collection workflows for European asset managers.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vexor - ZK-Graded NPL Portfolio Intelligence",
    description:
      "AI-powered NPL portfolio grading with zero-knowledge proofs. TCPP-compliant case management, GDPR-first architecture, and automated debt collection workflows for European asset managers.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Prefetch Barretenberg WASM for faster proving on /client-uploads */}
        <link rel="prefetch" href="/circuits/batch_grade.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
