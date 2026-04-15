import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Vexor</h3>
          <p className="text-sm leading-relaxed">
            AI-powered NPL case management for European debt collectors and asset managers.
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium text-sm mb-3">Trust &amp; Compliance</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">&#10003;</span> GDPR-Compliant Legal AI
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">&#10003;</span> EU Data Processing Only
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">&#10003;</span> Operating in PT, ES, IT, GR
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium text-sm mb-3">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/resources" className="hover:text-white transition-colors">Resources &amp; Guides</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="/gdpr-compliance" className="hover:text-white transition-colors">GDPR Compliance</Link></li>
            <li><Link href="/use-cases/npl-asset-managers" className="hover:text-white transition-colors">Use Cases</Link></li>
            <li><Link href="/compare" className="hover:text-white transition-colors">Compare Platforms</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; 2026 Vexor AI Solutions. All rights reserved.
      </div>
    </footer>
  );
}
