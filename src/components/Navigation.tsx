"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (href: string) =>
    `text-sm transition-colors duration-150 ${
      pathname === href
        ? "text-indigo-600 font-medium"
        : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <>
      {/* Hiring banner */}
      <div className="bg-indigo-600 text-white text-center py-1.5 text-[13px] tracking-tight">
        <Link href="/careers" className="hover:underline underline-offset-2">
          We&apos;re hiring - join the Vexor team &rarr;
        </Link>
      </div>

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/60">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-gray-900"
          >
            Vexor
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className={linkClass("")}>
              How it Works
            </Link>
            <Link href="/client-uploads" className={linkClass("/client-uploads")}>
              Client Uploads
            </Link>
            <Link href="/admin" className={linkClass("/admin")}>
              Admin
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="/#contact"
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-colors duration-150"
            >
              Schedule Demo
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-150"
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="5" y1="5" x2="15" y2="15" />
                  <line x1="15" y1="5" x2="5" y2="15" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="17" y2="6" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 pb-4 pt-2 space-y-1">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/client-uploads"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Client Uploads
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Admin
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition-colors"
            >
              Schedule Demo
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
