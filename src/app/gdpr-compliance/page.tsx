import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GDPR Compliance - Vexor AI",
  description: "GDPR-compliant legal AI for European debt collection and NPL management.",
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
      <section className="bg-gray-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            GDPR-Compliant Legal AI for Europe
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Built with a GDPR-first architecture from the ground up. Every component of Vexor is
            designed to meet and exceed European data protection requirements.
          </p>
        </div>
      </section>

      {/* Two Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Data Processing */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738.145l-.353.247a.89.89 0 00-.354.703v.08c0 .596.485 1.08 1.08 1.08h.08a.89.89 0 00.703-.354l.247-.353a.89.89 0 00.145-.738L17.5 8.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Data Processing Locations</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">&#10003;</span>
                  <span>All data processed and stored exclusively within the European Union</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">&#10003;</span>
                  <span>No transfer of personal data outside the EU at any point in the pipeline</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">&#10003;</span>
                  <span>Full compliance with GDPR Article 6 lawful basis requirements</span>
                </li>
              </ul>
            </div>

            {/* Security */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Security &amp; Encryption</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">&#10003;</span>
                  <span>End-to-end encryption for all data in transit and at rest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">&#10003;</span>
                  <span>Regular third-party security audits and penetration testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">&#10003;</span>
                  <span>Role-based access controls with comprehensive audit logging</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Three Principles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Our Data Protection Principles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((principle, i) => (
              <div key={principle.title} className="text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 font-bold text-sm">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{principle.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Trusted Across Europe
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Compliance Standards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Standards</h3>
              <ul className="space-y-3">
                {[
                  "GDPR (General Data Protection Regulation)",
                  "EU AI Act readiness",
                  "ISO 27001 aligned security practices",
                  "Regular Data Protection Impact Assessments",
                ].map((standard) => (
                  <li key={standard} className="flex items-center gap-3 text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                      &#10003;
                    </span>
                    {standard}
                  </li>
                ))}
              </ul>
            </div>

            {/* Operating Countries */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operating Countries</h3>
              <div className="grid grid-cols-2 gap-4">
                {countries.map((country) => (
                  <div
                    key={country.code}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center"
                  >
                    <span className="block text-2xl font-bold text-indigo-600 mb-1">
                      {country.code}
                    </span>
                    <span className="text-sm text-gray-600">{country.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Schedule a Demo</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            See how Vexor delivers GDPR-compliant AI processing for your NPL portfolio.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-lg"
          >
            Schedule a Demo
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
