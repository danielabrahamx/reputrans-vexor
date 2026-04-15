import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Founding Engineer Role - Careers at Vexor",
  description:
    "Join Vexor as a founding engineer. Build AI-powered NPL case management and zero-knowledge portfolio grading for European debt servicers. Remote, equity included.",
};

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-950 text-white pt-28 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-indigo-400 mb-4">
            Open positions
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3 leading-[1.1]">
            We&apos;re Hiring
          </h1>
          <p className="text-base text-gray-400 max-w-md mx-auto leading-relaxed">
            Join us in building AI that transforms debt collection across Europe.
          </p>
        </div>
      </section>

      {/* About Vexor */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-sm font-medium tracking-[0.15em] uppercase text-gray-400 mb-5">
            About Vexor
          </h2>
          <div className="border border-gray-200/60 rounded-xl p-6 md:p-8 text-gray-600 leading-[1.7] space-y-4 bg-gray-50/50">
            <p>
              Everyone said go to San Francisco. I bet everything on Madrid - and picked the
              hardest industry I could find. Debt collection is a 2 trillion euro market that the
              last three tech cycles didn&apos;t touch. Courts, legal deadlines, real consequences.
              AI here doesn&apos;t get to be a demo - it has to actually work.
            </p>
            <p>
              Ex-Revolut. Solo-built the MVP, landed one of Europe&apos;s largest debt servicers as
              our first client in 30 days. Now processing thousands of court documents daily. Backed
              by Project Europe and scaling fast.
            </p>
          </div>
        </div>
      </section>

      {/* Job Listing */}
      <section className="py-16 bg-gray-50/80">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white border border-gray-200/60 rounded-xl shadow-sm overflow-hidden">
            {/* Job Header */}
            <div className="px-6 md:px-8 pt-6 md:pt-8 pb-6 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-indigo-50 text-indigo-600 border border-indigo-100/60">
                  Full-time
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                  Remote
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-amber-50 text-amber-600 border border-amber-100/60">
                  Equity
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight mb-1.5">
                Founding Engineer
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Build the core platform powering AI-driven debt collection across Europe.
              </p>
            </div>

            {/* What We Need */}
            <div className="px-6 md:px-8 py-6 border-b border-gray-100">
              <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-gray-400 mb-3">
                What We Need
              </h3>
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                Hands-on founder-mindset engineer. You will own the technical direction and ship
                production systems from day one.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  "Python & FastAPI",
                  "LLMs & AI integration",
                  "GCP / AWS cloud infrastructure",
                  "Docker & Kubernetes",
                  "CI/CD pipelines",
                  "Product sense & user empathy",
                ].map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-2.5 text-sm text-gray-700 px-3 py-2 rounded-lg bg-gray-50/80 border border-gray-100/80"
                  >
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] leading-none">
                      &#10003;
                    </span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership */}
            <div className="px-6 md:px-8 py-6 border-b border-gray-100">
              <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-gray-400 mb-3">
                Leadership
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Hire, mentor, and own architecture decisions. You are not joining a team - you are
                building one.
              </p>
            </div>

            {/* Ownership */}
            <div className="px-6 md:px-8 py-6 border-b border-gray-100">
              <h3 className="text-xs font-medium tracking-[0.15em] uppercase text-gray-400 mb-3">
                Ownership
              </h3>
              <div className="bg-indigo-600/[0.04] border border-indigo-200/50 rounded-lg px-5 py-4">
                <p className="text-indigo-950 font-medium text-[15px] leading-snug">
                  Real ownership - in feeling and in equity.
                </p>
              </div>
            </div>

            {/* Apply */}
            <div className="px-6 md:px-8 py-7 bg-gray-50/50 text-center">
              <a
                href="mailto:careers@vexorai.eu?subject=Founding%20Engineer%20Application"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-7 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
              >
                Apply Now
                <span aria-hidden="true">&rarr;</span>
              </a>
              <p className="text-xs text-gray-400 mt-3">
                Send your CV and a short note on why you want to build Vexor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 tracking-tight mb-2">
            Don&apos;t see your role?
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            We&apos;re always looking for exceptional people. Reach out anyway.
          </p>
          <a
            href="mailto:careers@vexorai.eu"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-4 decoration-indigo-600/30 hover:decoration-indigo-600/60 transition-colors duration-200"
          >
            careers@vexorai.eu
          </a>
        </div>
      </section>
    </>
  );
}
