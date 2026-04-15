import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GDPR Compliance - Vexor AI | EU Data Protection for NPL Processing",
  description:
    "GDPR-first architecture for AI-powered debt collection. EU-only data processing, automated right-to-erasure workflows, and full audit trails for European NPL asset managers.",
};

export default function GDPRPage() {
  const principles = [
    {
      title: "Lawful Processing",
      description:
        "All data processing is grounded in a lawful basis under GDPR Article 6. We process personal data only when necessary for the performance of a contract, compliance with a legal obligation, or based on legitimate interests.",
    },
    {
      title: "Data Minimization",
      description:
        "We collect and process only the minimum data required to deliver our services. No unnecessary data is retained, and all processing is purpose-limited and proportionate.",
    },
    {
      title: "Right to Erasure",
      description:
        "Data subjects can request deletion of their personal data at any time. Our systems support automated erasure workflows to ensure timely compliance with Article 17 requests.",
    },
  ];

  const countries = [
    { code: "PT", name: "Portugal" },
    { code: "ES", name: "Spain" },
    { code: "IT", name: "Italy" },
    { code: "GR", name: "Greece" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950" />
        <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-24 text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-indigo-400 mb-4">
            Data Protection
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.1] mb-5">
            GDPR-Compliant Legal AI for Europe
          </h1>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto">
            Built with a GDPR-first architecture from the ground up. Every component of Vexor is
            designed to meet and exceed European data protection requirements.
          </p>
        </div>
      </section>

      {/* Two Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Data Processing */}
            <div className="bg-gray-50/80 border border-gray-200/60 rounded-xl p-7 transition-colors duration-200 hover:border-gray-300/80">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-5">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738.145l-.353.247a.89.89 0 00-.354.703v.08c0 .596.485 1.08 1.08 1.08h.08a.89.89 0 00.703-.354l.247-.353a.89.89 0 00.145-.738L17.5 8.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">Data Processing Locations</h3>
              <ul className="space-y-3">
                {[
                  "All data processed and stored exclusively within the European Union",
                  "No transfer of personal data outside the EU at any point in the pipeline",
                  "Full compliance with GDPR Article 6 lawful basis requirements",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security */}
            <div className="bg-gray-50/80 border border-gray-200/60 rounded-xl p-7 transition-colors duration-200 hover:border-gray-300/80">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-5">
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 tracking-tight">Security &amp; Encryption</h3>
              <ul className="space-y-3">
                {[
                  "End-to-end encryption for all data in transit and at rest",
                  "Regular third-party security audits and penetration testing",
                  "Role-based access controls with comprehensive audit logging",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Three Principles */}
      <section className="py-20 bg-gray-50 border-y border-gray-200/60">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-indigo-600 text-center mb-3">
            Foundations
          </p>
          <h2 className="text-2xl md:text-[1.75rem] font-semibold text-gray-900 text-center tracking-tight mb-14">
            Our Data Protection Principles
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {principles.map((principle, i) => (
              <div key={principle.title} className="text-center">
                <div className="w-8 h-8 rounded-full bg-gray-950 text-white flex items-center justify-center mx-auto mb-4 text-xs font-semibold">
                  {i + 1}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2.5 tracking-tight">{principle.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-indigo-600 text-center mb-3">
            Coverage
          </p>
          <h2 className="text-2xl md:text-[1.75rem] font-semibold text-gray-900 text-center tracking-tight mb-14">
            Trusted Across Europe
          </h2>

          <div className="grid md:grid-cols-2 gap-14 items-start">
            {/* Compliance Standards */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-5 tracking-tight">Compliance Standards</h3>
              <ul className="space-y-3.5">
                {[
                  "GDPR (General Data Protection Regulation)",
                  "EU AI Act readiness",
                  "ISO 27001 aligned security practices",
                  "Regular Data Protection Impact Assessments",
                ].map((standard) => (
                  <li key={standard} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-sm text-gray-600">{standard}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Operating Countries */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-5 tracking-tight">Operating Countries</h3>
              <div className="grid grid-cols-2 gap-3">
                {countries.map((country) => (
                  <div
                    key={country.code}
                    className="bg-gray-50/80 border border-gray-200/60 rounded-lg px-4 py-3.5 text-center transition-colors duration-200 hover:border-gray-300/80"
                  >
                    <span className="block text-lg font-semibold text-indigo-600 tracking-tight mb-0.5">
                      {country.code}
                    </span>
                    <span className="text-xs text-gray-500">{country.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950" />
        <div className="relative max-w-2xl mx-auto px-6 py-24 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4">Schedule a Demo</h2>
          <p className="text-gray-400 mb-8 text-base leading-relaxed">
            See how Vexor delivers GDPR-compliant AI processing for your NPL portfolio.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-2.5 rounded-lg hover:bg-indigo-500 transition-colors duration-200 font-medium text-sm"
          >
            Schedule a Demo
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
