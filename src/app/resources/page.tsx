import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources & Guides - Vexor AI | NPL Management Insights",
  description:
    "Expert guides, case studies, and industry analysis on AI-powered NPL portfolio management, GDPR-compliant debt collection, and legal AI tools for European markets.",
};

const articles = [
  {
    slug: "ai-case-management-npl-portfolios-europe",
    title: "Complete Guide to AI Case Management for NPL Portfolios in Europe",
    category: "Guide",
    categoryColor: "bg-indigo-100 text-indigo-700",
    readTime: "12 min read",
    description:
      "A comprehensive walkthrough of how AI-driven case management is reshaping NPL portfolio operations across European markets, from document intake to legal action.",
  },
  {
    slug: "ai-agents-vs-chatbots-debt-collectors",
    title: "AI Agents vs AI Chatbots: Why Debt Collectors Need Action, Not Answers",
    category: "Insights",
    categoryColor: "bg-violet-100 text-violet-700",
    readTime: "8 min read",
    description:
      "The critical difference between conversational AI and autonomous AI agents - and why the debt collection industry needs systems that execute, not just respond.",
  },
  {
    slug: "npl-document-processing-4-months-to-1-week",
    title: "NPL Document Processing: From 4-6 Months to 1 Week with AI",
    category: "Case Study",
    categoryColor: "bg-emerald-100 text-emerald-700",
    readTime: "10 min read",
    description:
      "How a leading European debt servicer transformed their document processing pipeline, cutting timelines by 95% while improving accuracy and compliance.",
  },
  {
    slug: "gdpr-compliant-legal-ai-european-asset-managers",
    title: "GDPR-Compliant Legal AI: What European Asset Managers Need to Know",
    category: "Compliance",
    categoryColor: "bg-amber-100 text-amber-700",
    readTime: "7 min read",
    description:
      "Navigating the intersection of AI automation and GDPR compliance. Essential reading for asset managers deploying AI in regulated European markets.",
  },
  {
    slug: "top-legal-ai-tools-npl-management-europe-2025",
    title: "Top Legal AI Tools for NPL Management in Europe 2025",
    category: "Comparison",
    categoryColor: "bg-sky-100 text-sky-700",
    readTime: "15 min read",
    description:
      "An in-depth comparison of the leading legal AI platforms for NPL management, covering features, compliance, pricing, and real-world performance across Southern European markets.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-950 text-white pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm font-medium tracking-widest uppercase text-indigo-400 mb-4">
            Resources
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-5">
            Resources &amp; Insights
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
            Expert guides, case studies, and analysis on AI-powered NPL management, GDPR compliance,
            and the future of debt collection in Europe.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="grid gap-4">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="group block"
              >
                <article className="relative bg-white border border-gray-200/60 rounded-xl p-6 md:p-7 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase ${article.categoryColor}`}
                    >
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{article.readTime}</span>
                  </div>

                  <h2 className="text-base md:text-lg font-semibold text-gray-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {article.title}
                  </h2>

                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {article.description}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 translate-y-0.5 group-hover:translate-y-0 transition-all duration-200">
                    Read Article
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 bg-gray-950 text-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
            Want to See Vexor in Action?
          </h2>
          <p className="text-gray-400 mb-8 text-base leading-relaxed">
            Schedule a personalized demo and see how Vexor can transform your NPL portfolio management.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-3 rounded-xl hover:bg-indigo-500 transition-colors duration-200 font-medium text-sm shadow-sm"
          >
            Schedule a Demo
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
