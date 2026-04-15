import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vexor - AI-Powered NPL Case Management",
  description: "AI that doesn't just read documents. It collects your debt.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Prefetch Barretenberg WASM for faster proving on /client-uploads */}
        <link rel="prefetch" href="/circuits/batch_grade.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
