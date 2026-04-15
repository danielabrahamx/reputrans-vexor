import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Compare Legal AI Platforms - Vexor vs Kira, Luminance, Harvey & More",
  description:
    "Side-by-side comparison of Vexor against Kira Systems, Luminance, Harvey AI, CollectAI, and Cognitiv+. See why NPL-focused AI outperforms general legal platforms for European debt collection.",
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 pb-20 pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-gray-950 to-gray-950" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
            Comparisons
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Compare Legal AI Platforms
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-400">
            See how Vexor&apos;s NPL-focused AI agent compares to other legal AI
            and debt collection platforms in Europe.
          </p>
        </div>
      </section>

      {/* Competitor cards grid */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-3 sm:grid-cols-2">
          {competitors.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="group relative rounded-xl border border-gray-200/60 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-[15px] font-semibold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600">
                    {c.title}
                  </h2>
                  <span className="mt-1.5 inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                    {c.tagline}
                  </span>
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
                    {c.description}
                  </p>
                </div>
                <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 transition-all duration-200 group-hover:bg-indigo-50">
                  <svg
                    className="h-3.5 w-3.5 text-gray-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-600"
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
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-950 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Ready to See Vexor in Action?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400">
            Book a demo and see how Vexor&apos;s AI agent handles your NPL
            portfolio end-to-end.
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500"
          >
            Schedule a Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
