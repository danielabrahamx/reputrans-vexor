"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Hiring banner */}
      <div className="bg-indigo-600 text-white text-center py-2 text-sm">
        <Link href="/careers" className="hover:underline">
          We&apos;re hiring - join the Vexor team &rarr;
        </Link>
      </div>

      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            Vexor
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/#how-it-works"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
            >
              How it Works
            </Link>

            <Link
              href="/client-uploads"
              className={`text-sm px-4 py-2 rounded-lg transition-all ${
                pathname === "/client-uploads"
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Client Uploads
            </Link>

            <Link
              href="/admin"
              className={`text-sm px-4 py-2 rounded-lg transition-all ${
                pathname === "/admin"
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Admin
            </Link>

            <Link
              href="/#contact"
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
