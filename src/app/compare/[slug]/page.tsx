import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type FeatureKey =
  | "nplFocus"
  | "actionOriented"
  | "gdpr"
  | "europeFirst"
  | "docSummarization"
  | "caseTimeline"
  | "workflowAutomation";

const featureLabels: Record<FeatureKey, string> = {
  nplFocus: "NPL-Specific Focus",
  actionOriented: "Action-Oriented",
  gdpr: "GDPR Compliant",
  europeFirst: "Europe-First",
  docSummarization: "Document Summarization",
  caseTimeline: "Case Timeline Automation",
  workflowAutomation: "Workflow Automation",
};

const featureKeys: FeatureKey[] = [
  "nplFocus",
  "actionOriented",
  "gdpr",
  "europeFirst",
  "docSummarization",
  "caseTimeline",
  "workflowAutomation",
];

interface CompetitorData {
  name: string;
  fullTitle: string;
  intro: string;
  focus: string;
  pricing: string;
  strengths: string;
  limitations: string;
  features: Record<FeatureKey, boolean>;
  whyVexor: string[];
}

const competitors: Record<string, CompetitorData> = {
  "kira-systems": {
    name: "Kira Systems",
    fullTitle: "Vexor vs Kira Systems",
    intro:
      "Kira Systems is a well-known legal document review platform that uses machine learning to identify and extract clauses from contracts. While powerful for general legal work, Kira was not designed for the specialized demands of non-performing loan (NPL) case management in Europe.",
    focus: "General legal document review",
    pricing: "Enterprise pricing",
    strengths: "Strong clause extraction and contract analysis",
    limitations: "Not NPL-specific - lacks debt collection workflows",
    features: {
      nplFocus: false,
      actionOriented: false,
      gdpr: true,
      europeFirst: false,
      docSummarization: true,
      caseTimeline: false,
      workflowAutomation: false,
    },
    whyVexor: [
      "Purpose-built for NPL portfolios - every feature is designed around debt recovery workflows.",
      "Action-oriented agent that takes steps on your behalf, not just a document reader.",
      "Built Europe-first with native GDPR compliance and multi-jurisdiction support.",
      "Automated case timelines that track debtor history across every touchpoint.",
    ],
  },
  luminance: {
    name: "Luminance",
    fullTitle: "Vexor vs Luminance",
    intro:
      "Luminance is a broad legal AI platform used by law firms for contract review, due diligence, and compliance. It offers impressive general capabilities but is not tailored for debt collection or NPL portfolio management.",
    focus: "General legal AI",
    pricing: "Enterprise pricing",
    strengths: "Broad legal AI capabilities across practice areas",
    limitations: "Not focused on debt collection or NPL workflows",
    features: {
      nplFocus: false,
      actionOriented: false,
      gdpr: true,
      europeFirst: false,
      docSummarization: true,
      caseTimeline: false,
      workflowAutomation: false,
    },
    whyVexor: [
      "Specialized NPL intelligence - understands debtor profiles, loan structures, and recovery strategies.",
      "Goes beyond document review to automate the entire collection lifecycle.",
      "Designed for European regulatory frameworks from day one.",
      "Delivers ROI on debt recovery, not just document processing speed.",
    ],
  },
  "harvey-ai": {
    name: "Harvey AI",
    fullTitle: "Vexor vs Harvey AI",
    intro:
      "Harvey AI is a legal research chatbot powered by large language models. It excels at answering legal questions and assisting with research, but it operates as a conversational tool - it does not take action on cases or manage workflows.",
    focus: "Legal chatbot",
    pricing: "Enterprise pricing",
    strengths: "Strong legal research and Q&A capabilities",
    limitations: "Chatbot only - does not take action or manage cases",
    features: {
      nplFocus: false,
      actionOriented: false,
      gdpr: false,
      europeFirst: false,
      docSummarization: true,
      caseTimeline: false,
      workflowAutomation: false,
    },
    whyVexor: [
      "Vexor is an action agent - it does not just answer questions, it executes collection workflows.",
      "Manages the full NPL case lifecycle from document intake to resolution.",
      "Generates enforceable outputs - letters, timelines, and compliance reports.",
      "Designed for debt recovery teams, not general legal research.",
    ],
  },
  collectai: {
    name: "CollectAI / Arvato",
    fullTitle: "Vexor vs CollectAI / Arvato",
    intro:
      "CollectAI (now part of Arvato) is a digital debt collection platform focused on payment reminders and customer communication. While it operates in the collections space, it relies on legacy architecture and lacks the AI-driven case intelligence that modern NPL teams need.",
    focus: "Debt collection platform",
    pricing: "SMB pricing",
    strengths: "Collection automation and payment reminders",
    limitations: "Legacy architecture - limited AI capabilities",
    features: {
      nplFocus: false,
      actionOriented: false,
      gdpr: false,
      europeFirst: false,
      docSummarization: false,
      caseTimeline: false,
      workflowAutomation: true,
    },
    whyVexor: [
      "Next-generation AI architecture vs legacy rules-based automation.",
      "Deep document understanding - reads and reasons about loan agreements, court filings, and debtor correspondence.",
      "Intelligent case prioritization based on recovery probability, not just rule triggers.",
      "Modern API-first design that integrates with your existing portfolio management systems.",
    ],
  },
  "cognitiv-plus": {
    name: "Cognitiv+",
    fullTitle: "Vexor vs Cognitiv+",
    intro:
      "Cognitiv+ is a document AI platform that automates data extraction and processing across industries. While it handles generic document workflows, it lacks the specialized NPL domain knowledge and collection-specific features that Vexor delivers.",
    focus: "Generic document AI",
    pricing: "Enterprise pricing",
    strengths: "Flexible document processing across industries",
    limitations: "Not NPL-specific - generic approach to document AI",
    features: {
      nplFocus: false,
      actionOriented: false,
      gdpr: false,
      europeFirst: false,
      docSummarization: true,
      caseTimeline: false,
      workflowAutomation: false,
    },
    whyVexor: [
      "Domain-specific NPL models trained on European debt collection documents.",
      "End-to-end case management, not just document extraction.",
      "Built-in compliance workflows for GDPR and European debt recovery regulations.",
      "Action-oriented agent that drives cases forward, not a passive processing tool.",
    ],
  },
};

const vexorFeatures: Record<FeatureKey, boolean> = {
  nplFocus: true,
  actionOriented: true,
  gdpr: true,
  europeFirst: true,
  docSummarization: true,
  caseTimeline: true,
  workflowAutomation: true,
};

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return [
    { slug: "kira-systems" },
    { slug: "luminance" },
    { slug: "harvey-ai" },
    { slug: "collectai" },
    { slug: "cognitiv-plus" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = competitors[slug];
  if (!data) return {};
  return {
    title: `${data.fullTitle} - Compare Legal AI | Vexor`,
    description: data.intro.slice(0, 160),
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Check() {
  return (
    <svg
      className="h-5 w-5 text-emerald-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      className="h-5 w-5 text-gray-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function CompareSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = competitors[slug];
  if (!data) notFound();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/compare"
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-6"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All comparisons
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            {data.fullTitle}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl">{data.intro}</p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Feature Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 pr-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="py-4 px-4 text-center text-sm font-semibold text-indigo-600 uppercase tracking-wider">
                  Vexor
                </th>
                <th className="py-4 pl-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {data.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {featureKeys.map((key) => (
                <tr key={key} className="border-b border-gray-100">
                  <td className="py-4 pr-4 text-sm text-gray-700">
                    {featureLabels[key]}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex justify-center">
                      {vexorFeatures[key] ? <Check /> : <Cross />}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-center">
                    <span className="inline-flex justify-center">
                      {data.features[key] ? <Check /> : <Cross />}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Competitor overview card */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {data.name} Overview
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Focus
              </h3>
              <p className="mt-1 text-gray-700">{data.focus}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Pricing
              </h3>
              <p className="mt-1 text-gray-700">{data.pricing}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Strengths
              </h3>
              <p className="mt-1 text-gray-700">{data.strengths}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Limitations
              </h3>
              <p className="mt-1 text-gray-700">{data.limitations}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Vexor */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Why Choose Vexor Over {data.name}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.whyVexor.map((reason, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-lg bg-white p-5 border border-gray-100"
              >
                <span className="mt-0.5 flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <p className="text-sm text-gray-700">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Schedule a Demo</h2>
          <p className="mt-3 text-indigo-100 max-w-xl mx-auto">
            See how Vexor outperforms {data.name} for your NPL portfolio.
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Book Your Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
