import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compare Legal AI Platforms - Vexor",
  description:
    "See how Vexor's NPL-focused AI agent compares to other legal AI and debt collection platforms in Europe.",
};

const competitors = [
  {
    slug: "kira-systems",
    title: "Vexor vs Kira Systems",
    tagline: "NPL-Focused Document AI",
    description:
      "Compare general legal doc review with specialized NPL case management.",
  },
  {
    slug: "luminance",
    title: "Vexor vs Luminance",
    tagline: "AI for Debt Collection vs General Legal",
    description: "NPL-focused vs general legal AI.",
  },
  {
    slug: "harvey-ai",
    title: "Vexor vs Harvey AI",
    tagline: "Action Agent vs Legal Chatbot",
    description: "Action-oriented agent vs chatbot.",
  },
  {
    slug: "collectai",
    title: "Vexor vs CollectAI / Arvato",
    tagline: "Next-Gen NPL Case Management",
    description: "Compare debt collection platforms.",
  },
  {
    slug: "cognitiv-plus",
    title: "Vexor vs Cognitiv+",
    tagline: "Specialized NPL vs Generic Document AI",
    description: "NPL-focused vs generic.",
  },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Compare Legal AI Platforms
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            See how Vexor&apos;s NPL-focused AI agent compares to other legal AI
            and debt collection platforms in Europe.
          </p>
        </div>
      </section>

      {/* Competitor cards grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="group rounded-xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {c.title}
              </h2>
              <span className="mt-2 inline-block text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {c.tagline}
              </span>
              <p className="mt-3 text-sm text-gray-600">{c.description}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                View comparison
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to See Vexor in Action?
          </h2>
          <p className="mt-3 text-indigo-100 max-w-xl mx-auto">
            Book a demo and see how Vexor&apos;s AI agent handles your NPL
            portfolio end-to-end.
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Schedule a Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
