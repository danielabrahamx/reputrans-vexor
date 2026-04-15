import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-white font-semibold text-base tracking-tight mb-2.5">
              Vexor
            </h3>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              AI-powered NPL case management for European debt collectors and asset managers.
            </p>
          </div>

          {/* Trust & Compliance */}
          <div>
            <h4 className="text-white font-medium text-sm mb-3">
              Trust &amp; Compliance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 text-xs">&#10003;</span>
                GDPR-Compliant Legal AI
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 text-xs">&#10003;</span>
                EU Data Processing Only
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 text-xs">&#10003;</span>
                Operating in PT, ES, IT, GR
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/resources"
                  className="text-gray-500 hover:text-white transition-colors duration-150"
                >
                  Resources &amp; Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-500 hover:text-white transition-colors duration-150"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/gdpr-compliance"
                  className="text-gray-500 hover:text-white transition-colors duration-150"
                >
                  GDPR Compliance
                </Link>
              </li>
              <li>
                <Link
                  href="/use-cases/npl-asset-managers"
                  className="text-gray-500 hover:text-white transition-colors duration-150"
                >
                  Use Cases
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-gray-500 hover:text-white transition-colors duration-150"
                >
                  Compare Platforms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/60">
        <div className="max-w-6xl mx-auto px-5 py-5 text-center text-xs text-gray-600">
          &copy; 2026 Vexor AI Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
