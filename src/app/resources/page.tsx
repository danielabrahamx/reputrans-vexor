import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources & Insights - Vexor AI",
  description: "Expert guides, case studies, and insights on AI-powered NPL management in Europe.",
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
      <section className="bg-gray-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Resources &amp; Insights
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Expert guides, case studies, and analysis on AI-powered NPL management, GDPR compliance,
            and the future of debt collection in Europe.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-8">
            {articles.map((article) => (
              <article
                key={article.slug}
                className="group bg-white border border-gray-200 rounded-xl p-8 hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${article.categoryColor}`}
                  >
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-400">{article.readTime}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {article.title}
                </h2>

                <p className="text-gray-600 mb-5 leading-relaxed">{article.description}</p>

                <Link
                  href={`/resources/${article.slug}`}
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  Read Article
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Want to See Vexor in Action?</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Schedule a personalized demo and see how Vexor can transform your NPL portfolio management.
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
