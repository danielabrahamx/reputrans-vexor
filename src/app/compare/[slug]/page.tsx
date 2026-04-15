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
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50" role="img" aria-label="Yes">
      <svg
        className="h-3 w-3 text-emerald-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </span>
  );
}

function Cross() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-50" role="img" aria-label="No">
      <svg
        className="h-3 w-3 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </span>
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 pb-16 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-gray-950 to-gray-950" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors duration-200 hover:text-white"
          >
            <svg
              className="h-3.5 w-3.5"
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
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            {data.fullTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400">
            {data.intro}
          </p>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">
          Feature Comparison
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/60">
                <th className="pb-3 pr-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  Feature
                </th>
                <th className="pb-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Vexor
                </th>
                <th className="pb-3 pl-4 text-center text-xs font-medium uppercase tracking-wider text-gray-400">
                  {data.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {featureKeys.map((key, i) => (
                <tr
                  key={key}
                  className={
                    i < featureKeys.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                >
                  <td className="py-3 pr-4 text-sm text-gray-600">
                    {featureLabels[key]}
                  </td>
                  <td className="py-3 px-4">
                    <span className="flex justify-center">
                      {vexorFeatures[key] ? <Check /> : <Cross />}
                    </span>
                  </td>
                  <td className="py-3 pl-4">
                    <span className="flex justify-center">
                      {data.features[key] ? <Check /> : <Cross />}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Competitor overview */}
      <section className="mx-auto max-w-3xl px-6 pb-14">
        <div className="rounded-xl border border-gray-200/60 bg-gray-50/50 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            {data.name} Overview
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Focus
              </h3>
              <p className="mt-1 text-sm text-gray-700">{data.focus}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Pricing
              </h3>
              <p className="mt-1 text-sm text-gray-700">{data.pricing}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Strengths
              </h3>
              <p className="mt-1 text-sm text-gray-700">{data.strengths}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Limitations
              </h3>
              <p className="mt-1 text-sm text-gray-700">{data.limitations}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Vexor */}
      <section className="border-t border-gray-100 bg-gray-50/50 py-14">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">
            Why Choose Vexor Over {data.name}
          </h2>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {data.whyVexor.map((reason, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-lg border border-gray-200/60 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 flex-shrink-0">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50">
                    <svg
                      className="h-3 w-3 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                </span>
                <p className="text-[13px] leading-relaxed text-gray-600">
                  {reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-950 py-14">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Schedule a Demo
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-400">
            See how Vexor outperforms {data.name} for your NPL portfolio.
          </p>
          <Link
            href="/#contact"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-500"
          >
            Book Your Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
