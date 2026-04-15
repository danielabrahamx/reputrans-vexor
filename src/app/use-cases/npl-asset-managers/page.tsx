import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI for NPL Asset Managers - Vexor | Portfolio Processing in Days, Not Months",
  description:
    "Transform NPL portfolio processing from months to days. AI-driven document analysis, case prioritization, legal workflow automation, and GDPR-compliant operations across European jurisdictions.",
};

const features = [
  {
    title: "Automated Document Analysis",
    description:
      "AI reads, classifies, and extracts key data from court documents, contracts, and legal filings in seconds - across multiple languages and jurisdictions.",
  },
  {
    title: "AI Case Prioritization",
    description:
      "Intelligent scoring ranks cases by recovery potential, legal deadlines, and complexity - so your team focuses on what moves the needle.",
  },
  {
    title: "Legal Action Automation",
    description:
      "Automatically generate legal filings, track court deadlines, and trigger workflows based on case status changes and jurisdiction-specific rules.",
  },
  {
    title: "Portfolio Analytics",
    description:
      "Real-time dashboards showing recovery rates, case velocity, portfolio health, and trend analysis across your entire NPL book.",
  },
  {
    title: "GDPR Compliance Built-In",
    description:
      "EU-only data processing, automated data minimization, right-to-erasure workflows, and full audit trails baked into every operation.",
  },
  {
    title: "System Integration",
    description:
      "Seamless API integration with your existing portfolio management systems, court portals, and document management platforms.",
  },
];

const benefits = [
  {
    metric: "4-6 months to 1 week",
    label: "Processing Time",
    description: "Reduce NPL portfolio onboarding and processing from months to days.",
  },
  {
    metric: "16x ROI",
    label: "Return on Investment",
    description: "Measured return on investment from automated case management workflows.",
  },
  {
    metric: "Replace manual headcount",
    label: "Operational Efficiency",
    description: "Automate repetitive document review and data entry tasks at scale.",
  },
  {
    metric: "Higher recovery rates",
    label: "Recovery Performance",
    description: "AI-driven prioritization and faster action improve overall recovery outcomes.",
  },
  {
    metric: "Scale without headcount",
    label: "Scalability",
    description: "Process 10x the portfolio volume without proportional team growth.",
  },
  {
    metric: "GDPR built-in",
    label: "Compliance",
    description: "No compliance bolt-ons. Data protection is native to the architecture.",
  },
];

const steps = [
  {
    step: 1,
    title: "Document Ingestion",
    description:
      "Upload portfolio documents in bulk. Vexor accepts PDFs, scans, emails, and structured data from any source.",
  },
  {
    step: 2,
    title: "AI Analysis",
    description:
      "Our AI reads every document, extracts entities, classifies case types, and identifies key legal dates and obligations.",
  },
  {
    step: 3,
    title: "Case Prioritization",
    description:
      "Cases are automatically scored and ranked by recovery potential, urgency, and complexity for optimal resource allocation.",
  },
  {
    step: 4,
    title: "Workflow Automation",
    description:
      "Legal filings are generated, court deadlines tracked, and team actions triggered based on intelligent rules and case status.",
  },
  {
    step: 5,
    title: "Portfolio Analytics",
    description:
      "Monitor performance with real-time dashboards covering recovery rates, case velocity, and portfolio-level trends.",
  },
];

export default function NPLUseCasePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gray-950 overflow-hidden">
        {/* Subtle radial gradient accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950" />
        <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-24 text-center">
          <p className="text-indigo-400 text-sm font-medium tracking-wide uppercase mb-4">
            Use Case
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.1] mb-6">
            AI-Powered NPL Portfolio Management
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform your NPL portfolio processing from months to days. Vexor automates document
            analysis, case prioritization, and legal workflows across European jurisdictions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-500 transition-colors text-sm font-medium"
            >
              Schedule a Demo
              <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white px-6 py-2.5 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors text-sm font-medium"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-indigo-600 text-sm font-medium tracking-wide uppercase mb-2">
              Capabilities
            </p>
            <h2 className="text-3xl font-semibold text-gray-950 tracking-tight">
              Key Features
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-200/60 bg-gray-50/50 p-6 hover:border-indigo-200 hover:bg-white transition-all duration-200"
              >
                <h3 className="text-[15px] font-semibold text-gray-950 mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50/80">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-indigo-600 text-sm font-medium tracking-wide uppercase mb-2">
              Results
            </p>
            <h2 className="text-3xl font-semibold text-gray-950 tracking-tight">
              Measurable Impact
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.label}
                className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm"
              >
                <p className="text-indigo-600 font-semibold text-lg tracking-tight mb-0.5">
                  {benefit.metric}
                </p>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mb-3">
                  {benefit.label}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-indigo-600 text-sm font-medium tracking-wide uppercase mb-2">
              Process
            </p>
            <h2 className="text-3xl font-semibold text-gray-950 tracking-tight">
              How It Works
            </h2>
          </div>
          <div className="space-y-0">
            {steps.map((item, i) => (
              <div key={item.title} className="relative flex gap-5 pb-10 last:pb-0">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[18px] top-10 w-px h-[calc(100%-16px)] bg-gradient-to-b from-indigo-200 to-indigo-100" />
                )}
                {/* Step number */}
                <div className="relative flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-semibold text-xs">
                  {item.step}
                </div>
                {/* Content */}
                <div className="pt-0.5 min-w-0">
                  <h3 className="text-[15px] font-semibold text-gray-950 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950" />
        <div className="relative max-w-2xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight leading-tight mb-4">
            Ready to Transform Your NPL Portfolio Management?
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            See how Vexor processes thousands of documents daily for Europe&apos;s leading debt
            servicers.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-3 rounded-lg hover:bg-indigo-500 transition-colors font-medium text-sm"
          >
            Schedule a Demo
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </>
  );
}
