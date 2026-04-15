import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const faqItems = [
  {
    q: "How does Vexor compare to Kira Systems or Luminance for NPL?",
    a: "Kira and Luminance extract clauses. Vexor goes further: it classifies court notifications, updates your CRM, identifies settlement leverage, and triggers debtor outreach - all autonomously. Extraction is step one. Execution is the whole game.",
  },
  {
    q: "Is Vexor GDPR compliant for European asset managers?",
    a: "Yes. All data processing occurs within the EU. We operate under strict data processing agreements, support data subject access requests, and maintain full audit trails for every AI decision. No data ever leaves European infrastructure.",
  },
  {
    q: "What's the difference between an AI chatbot and Vexor's AI agent?",
    a: "A chatbot waits for your question. Vexor acts. When a court notification arrives, the agent extracts data, classifies priority, updates your CRM, identifies leverage points, and triggers outreach - without anyone asking it to.",
  },
  {
    q: "How fast can Vexor process NPL document portfolios?",
    a: "A single court notification is classified and actioned within minutes. Bulk portfolio ingestion processes thousands of documents in hours, not the weeks it takes manual legal teams.",
  },
  {
    q: "What types of legal documents can the AI analyze?",
    a: "Court notifications, judicial summons, opposition filings, payment orders, enforcement notices, and debtor correspondence across Portuguese, Spanish, Italian, and Greek legal systems.",
  },
  {
    q: "How does AI case management work for non-performing loans?",
    a: "Each case gets a living profile: court status, debtor contact history, settlement probability, and recommended next action. The AI continuously updates this profile as new documents arrive and outreach progresses.",
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <>
      {/* ============================================================ */}
      {/*  1. HERO                                                     */}
      {/* ============================================================ */}
      <section className="relative bg-gray-950 overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <p className="text-sm font-medium tracking-wide text-indigo-400 uppercase mb-6">
            AI-powered case management for NPL portfolios in Europe
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            AI that doesn&apos;t just read documents.
            <br />
            <span className="text-indigo-400">It collects your debt.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            From court notification to borrower outreach in minutes, not days.
          </p>

          <p className="mt-4 text-sm text-gray-500">
            Operating in: <span className="text-gray-300 font-medium">PT, ES, IT, GR</span>
          </p>

          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="#contact"
              className="bg-indigo-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
            >
              Schedule Demo
            </Link>
            <Link
              href="#how-it-works"
              className="border border-gray-700 text-gray-300 text-sm font-medium px-6 py-3 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
            >
              How it Works
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  2. PLATFORM DIAGRAM                                         */}
      {/* ============================================================ */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              No platform hopping. Works inside your system.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-6 md:gap-0">
            {/* Data Sources */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 text-center">Data Sources</p>
              {["Legal Systems", "Debt Portfolios", "Skip Tracking"].map((item) => (
                <div
                  key={item}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 text-center bg-gray-50"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:flex items-center justify-center px-4">
              <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-indigo-400">
                <path d="M0 8h32m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Mobile arrow */}
            <div className="flex md:hidden items-center justify-center py-2">
              <svg width="16" height="40" viewBox="0 0 16 40" fill="none" className="text-indigo-400">
                <path d="M8 0v32m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Processing Engine */}
            <div className="relative">
              <div className="border-2 border-indigo-600 rounded-xl px-6 py-8 text-center bg-indigo-50/50">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white">
                    <path d="M10 2L2 7l8 5 8-5-8-5zM2 13l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-indigo-900">Vexor AI</p>
                <p className="text-xs text-indigo-600 mt-0.5">Processing Engine</p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:flex items-center justify-center px-4">
              <svg width="40" height="16" viewBox="0 0 40 16" fill="none" className="text-indigo-400">
                <path d="M0 8h32m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Mobile arrow */}
            <div className="flex md:hidden items-center justify-center py-2">
              <svg width="16" height="40" viewBox="0 0 16 40" fill="none" className="text-indigo-400">
                <path d="M8 0v32m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Active Actions */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 text-center">Active Actions</p>
              {["CRM Integration", "Contact Debtor", "Contact Judiciary"].map((item) => (
                <div
                  key={item}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 text-center bg-gray-50"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  3. INTELLIGENT TRIAGE                                       */}
      {/* ============================================================ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              AI instantly classifies every notification and updates your CRM
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mock notification - ARCHIVE */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Court Notification #4821</p>
                <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
                  ARCHIVE
                </span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="font-mono text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p>Tribunal Judicial da Comarca de Lisboa</p>
                  <p>Processo n. 12847/23.0T8LSB</p>
                  <p className="mt-2">Notificacao: Juncao de documentos ao processo.</p>
                  <p>Prazo: Sem prazo aplicavel.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2 3-3.5" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Routine filing.</span> Documents attached to case. No deadline, no action required. Auto-archived.
                  </p>
                </div>
              </div>
            </div>

            {/* Mock notification - ACTION REQUIRED */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-red-50 border-b border-red-200 flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Court Notification #4822</p>
                <span className="text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                  ACTION REQUIRED
                </span>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="font-mono text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p>Tribunal Judicial da Comarca do Porto</p>
                  <p>Processo n. 9283/23.8T8PRT</p>
                  <p className="mt-2">Notificacao: Oposicao a execucao apresentada pelo executado.</p>
                  <p>Prazo: 10 dias para resposta.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M4 2v2.5M4 6h.005" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-red-700">Opposition filed.</span> Debtor contesting execution. 10-day deadline. CRM updated, legal team notified, outreach paused.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            95% classification accuracy. Human review on every action.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. TRADITIONAL VS VEXOR                                     */}
      {/* ============================================================ */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional */}
            <div className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Traditional Workflow</h3>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-6">Days to weeks</p>
              <ol className="space-y-4">
                {[
                  "Notification arrives via post or portal",
                  "Legal analyst reads and classifies manually",
                  "Amicable team calls debtor without context",
                  "No shared context across departments",
                  "Resolution takes days or weeks",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-medium flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-600 leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Vexor */}
            <div className="rounded-xl border-2 border-indigo-600 p-6 bg-indigo-50/30">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Vexor Workflow</h3>
              <p className="text-xs text-indigo-600 uppercase tracking-wider font-semibold mb-6">Minutes</p>
              <ol className="space-y-4">
                {[
                  "Notification arrives",
                  "AI extracts and classifies instantly",
                  "CRM updated with full context",
                  "Settlement leverage identified",
                  "Outreach triggered automatically",
                  "Settlement reached faster",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 leading-snug">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  5. IMPACT METRICS                                           */}
      {/* ============================================================ */}
      <section className="bg-gray-950 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: "15%", label: "Gross margin improvement" },
              { value: "95%", label: "Classification accuracy" },
              { value: "Minutes", sub: "vs Days", label: "Time to action" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
                  {stat.value}
                  {stat.sub && (
                    <span className="text-lg font-medium text-gray-500 ml-2">{stat.sub}</span>
                  )}
                </p>
                <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  6. CONTACT FORM                                             */}
      {/* ============================================================ */}
      <section id="contact" className="bg-white py-20">
        <div className="max-w-xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Get started</h2>
            <p className="mt-2 text-sm text-gray-500">
              Tell us about your portfolio and we will show you what Vexor can do.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* ============================================================ */}
      {/*  7. FAQ                                                      */}
      {/* ============================================================ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-10 text-center">
            Frequently asked questions
          </h2>

          <div className="space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.q}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm"
              >
                <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-medium text-gray-900 select-none [&::-webkit-details-marker]:hidden list-none">
                  {item.q}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 ml-4 text-gray-400 transition-transform group-open:rotate-45"
                  >
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
