import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NPL Asset Managers - Vexor AI",
  description: "AI-powered NPL portfolio management. Transform processing from months to days.",
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
      <section className="bg-gray-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            AI-Powered NPL Portfolio Management
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Transform your NPL portfolio processing from months to days. Vexor automates document
            analysis, case prioritization, and legal workflows across European jurisdictions.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-indigo-200 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Measurable Impact
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.label} className="bg-white border border-gray-200 rounded-xl p-6">
                <p className="text-indigo-600 font-bold text-lg mb-1">{benefit.metric}</p>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-3">
                  {benefit.label}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="space-y-0">
            {steps.map((item, i) => (
              <div key={item.title} className="relative flex gap-6 pb-10">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-10 w-px h-full bg-indigo-200" />
                )}
                {/* Step number */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm z-10">
                  {item.step}
                </div>
                {/* Content */}
                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your NPL Portfolio Management?
          </h2>
          <p className="text-indigo-100 mb-8 text-lg">
            See how Vexor processes thousands of documents daily for Europe&apos;s leading debt
            servicers.
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
