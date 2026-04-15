import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Vexor - AI-Powered NPL Case Management | Court Notification to Outreach in Minutes",
  description:
    "AI that classifies court notifications, updates your CRM, identifies settlement leverage, and triggers debtor outreach autonomously. Operating in PT, ES, IT, GR.",
};

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
      <section className="relative bg-gray-950 overflow-hidden isolate">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />

        <div className="relative max-w-3xl mx-auto px-6 pt-32 pb-28 text-center">
          <p
            className="text-[13px] font-medium tracking-widest text-indigo-400 uppercase mb-6 animate-[fadeInUp_600ms_ease-out_both]"
          >
            AI-powered case management for NPL portfolios in Europe
          </p>

          <h1
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.08] animate-[fadeInUp_600ms_ease-out_100ms_both]"
          >
            AI that doesn&apos;t just read documents.
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent"> It collects your debt.</span>
          </h1>

          <p
            className="mt-6 text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed animate-[fadeInUp_600ms_ease-out_200ms_both]"
          >
            From court notification to borrower outreach in minutes, not days.
          </p>

          <p
            className="mt-3 text-[13px] text-gray-500 tracking-wide animate-[fadeInUp_600ms_ease-out_250ms_both]"
          >
            Operating in: <span className="text-gray-300 font-medium">PT, ES, IT, GR</span>
          </p>

          <div
            className="mt-10 flex items-center justify-center gap-3 animate-[fadeInUp_600ms_ease-out_350ms_both]"
          >
            <Link
              href="#contact"
              className="bg-indigo-600 text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-indigo-500 active:scale-[0.97] transition-all duration-150"
            >
              Schedule Demo
            </Link>
            <Link
              href="#how-it-works"
              className="border border-gray-700/80 text-gray-300 text-sm font-medium px-6 py-2.5 rounded-lg hover:border-gray-500 hover:text-white active:scale-[0.97] transition-all duration-150"
            >
              How it Works
            </Link>
          </div>
        </div>

        {/* Bottom fade line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />
      </section>

      {/* ============================================================ */}
      {/*  2. PLATFORM DIAGRAM                                         */}
      {/* ============================================================ */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              No platform hopping. Works inside your system.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-5 md:gap-0">
            {/* Data Sources */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3 text-center">Data Sources</p>
              {["Legal Systems", "Debt Portfolios", "Skip Tracking"].map((item) => (
                <div
                  key={item}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 text-center bg-white hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-150"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:flex items-center justify-center px-3">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none" className="text-indigo-300" aria-hidden="true">
                <path d="M0 6h24m0 0l-4-4.5m4 4.5l-4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex md:hidden items-center justify-center py-1">
              <svg width="12" height="32" viewBox="0 0 12 32" fill="none" className="text-indigo-300" aria-hidden="true">
                <path d="M6 0v24m0 0l-4.5-4m4.5 4l4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Processing Engine */}
            <div className="relative">
              <div className="border-2 border-indigo-200 rounded-xl px-5 py-7 text-center bg-gradient-to-b from-indigo-50/80 to-white shadow-sm">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-white" aria-hidden="true">
                    <path d="M10 2L2 7l8 5 8-5-8-5zM2 13l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-900">Vexor AI</p>
                <p className="text-[11px] text-indigo-600 mt-0.5 font-medium">Processing Engine</p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:flex items-center justify-center px-3">
              <svg width="32" height="12" viewBox="0 0 32 12" fill="none" className="text-indigo-300" aria-hidden="true">
                <path d="M0 6h24m0 0l-4-4.5m4 4.5l-4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex md:hidden items-center justify-center py-1">
              <svg width="12" height="32" viewBox="0 0 12 32" fill="none" className="text-indigo-300" aria-hidden="true">
                <path d="M6 0v24m0 0l-4.5-4m4.5 4l4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Active Actions */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3 text-center">Active Actions</p>
              {["CRM Integration", "Contact Debtor", "Contact Judiciary"].map((item) => (
                <div
                  key={item}
                  className="border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 text-center bg-white hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-150"
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
      <section className="bg-gray-50/80 py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              AI instantly classifies every notification and updates your CRM
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mock notification - ARCHIVE */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Court Notification #4821</p>
                <span className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                  ARCHIVE
                </span>
              </div>
              <div className="px-4 py-4 space-y-3">
                <div className="font-mono text-[11px] text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p>Tribunal Judicial da Comarca de Lisboa</p>
                  <p>Processo n. 12847/23.0T8LSB</p>
                  <p className="mt-1.5">Notificacao: Juncao de documentos ao processo.</p>
                  <p>Prazo: Sem prazo aplicavel.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5l2.5 2.5 3.5-4" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-snug">
                    <span className="font-medium text-gray-700">Routine filing.</span> Documents attached to case. No deadline, no action required. Auto-archived.
                  </p>
                </div>
              </div>
            </div>

            {/* Mock notification - ACTION REQUIRED */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="px-4 py-2.5 bg-red-50/80 border-b border-red-100 flex items-center justify-between">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Court Notification #4822</p>
                <span className="text-[11px] font-semibold bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full">
                  ACTION REQUIRED
                </span>
              </div>
              <div className="px-4 py-4 space-y-3">
                <div className="font-mono text-[11px] text-gray-500 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p>Tribunal Judicial da Comarca do Porto</p>
                  <p>Processo n. 9283/23.8T8PRT</p>
                  <p className="mt-1.5">Notificacao: Oposicao a execucao apresentada pelo executado.</p>
                  <p>Prazo: 10 dias para resposta.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M5 2.5v3M5 7.5h.005" stroke="#dc2626" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-snug">
                    <span className="font-medium text-red-600">Opposition filed.</span> Debtor contesting execution. 10-day deadline. CRM updated, legal team notified, outreach paused.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[13px] text-gray-400 mt-8">
            95% classification accuracy. Human review on every action.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. TRADITIONAL VS VEXOR                                     */}
      {/* ============================================================ */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="sr-only">Traditional Workflow vs Vexor Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Traditional */}
            <div className="rounded-xl border border-gray-200 p-6 bg-white">
              <h3 className="text-base font-bold text-gray-900 mb-0.5">Traditional Workflow</h3>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium mb-6">Days to weeks</p>
              <ol className="space-y-3.5">
                {[
                  "Notification arrives via post or portal",
                  "Legal analyst reads and classifies manually",
                  "Amicable team calls debtor without context",
                  "No shared context across departments",
                  "Resolution takes days or weeks",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-400 text-[11px] font-medium flex items-center justify-center mt-px">
                      {i + 1}
                    </span>
                    <span className="text-[13px] text-gray-500 leading-snug pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Vexor */}
            <div className="rounded-xl border-2 border-indigo-200 p-6 bg-gradient-to-b from-indigo-50/50 to-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.06),transparent_70%)]" />
              <h3 className="text-base font-bold text-gray-900 mb-0.5 relative">Vexor Workflow</h3>
              <p className="text-[11px] text-indigo-600 uppercase tracking-widest font-semibold mb-6 relative">Minutes</p>
              <ol className="space-y-3.5 relative">
                {[
                  "Notification arrives",
                  "AI extracts and classifies instantly",
                  "CRM updated with full context",
                  "Settlement leverage identified",
                  "Outreach triggered automatically",
                  "Settlement reached faster",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-medium flex items-center justify-center mt-px shadow-[0_1px_3px_rgba(99,102,241,0.3)]">
                      {i + 1}
                    </span>
                    <span className="text-[13px] text-gray-600 leading-snug pt-0.5">{step}</span>
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
      <section className="relative bg-gray-950 py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(99,102,241,0.08),transparent)]" />
        <div className="relative max-w-3xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: "15%", label: "Gross margin improvement" },
              { value: "95%", label: "Classification accuracy" },
              { value: "Minutes", sub: "vs Days", label: "Time to action" },
            ].map((stat) => (
              <div key={stat.label} className="group">
                <p className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.value}
                  {stat.sub && (
                    <span className="text-sm font-medium text-gray-500 ml-1.5">{stat.sub}</span>
                  )}
                </p>
                <p className="mt-2 text-[13px] text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  6. CONTACT FORM                                             */}
      {/* ============================================================ */}
      <section id="contact" className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-lg mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Get started</h2>
            <p className="mt-2 text-sm text-gray-400">
              Tell us about your portfolio and we will show you what Vexor can do.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* ============================================================ */}
      {/*  7. FAQ                                                      */}
      {/* ============================================================ */}
      <section className="bg-gray-50/80 py-20 border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-10 text-center">
            Frequently asked questions
          </h2>

          <div className="space-y-2.5">
            {faqItems.map((item) => (
              <details
                key={item.q}
                className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200"
              >
                <summary className="flex items-center justify-between cursor-pointer px-5 py-3.5 text-[13px] font-medium text-gray-900 select-none [&::-webkit-details-marker]:hidden list-none hover:bg-gray-50/50 transition-colors rounded-xl">
                  {item.q}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="flex-shrink-0 ml-4 text-gray-300 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-45"
                  >
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-[13px] text-gray-500 leading-relaxed">
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
