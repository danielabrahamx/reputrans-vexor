import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Careers - Vexor AI",
  description: "Join Vexor and help build AI that transforms debt collection across Europe.",
};

export default function CareersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            We&apos;re Hiring
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join us in building AI that transforms debt collection across Europe.
          </p>
        </div>
      </section>

      {/* About Vexor */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About Vexor</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-gray-700 leading-relaxed space-y-4">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Job Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Founding Engineer</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    Full-time
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    Remote
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    Equity
                  </span>
                </div>
              </div>
              <p className="text-gray-600">
                Build the core platform powering AI-driven debt collection across Europe.
              </p>
            </div>

            {/* What We Need */}
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What We Need</h3>
              <p className="text-gray-700 mb-6">
                Hands-on founder-mindset engineer. You will own the technical direction and ship
                production systems from day one.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Python & FastAPI",
                  "LLMs & AI integration",
                  "GCP / AWS cloud infrastructure",
                  "Docker & Kubernetes",
                  "CI/CD pipelines",
                  "Product sense & user empathy",
                ].map((skill) => (
                  <div key={skill} className="flex items-center gap-3 text-gray-700">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                      &#10003;
                    </span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership */}
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leadership</h3>
              <p className="text-gray-700">
                Hire, mentor, and own architecture decisions. You are not joining a team - you are
                building one.
              </p>
            </div>

            {/* Ownership */}
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ownership</h3>
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
                <p className="text-indigo-900 font-medium text-lg">
                  Real ownership - in feeling and in equity.
                </p>
              </div>
            </div>

            {/* Apply */}
            <div className="p-8 bg-gray-50 text-center">
              <a
                href="mailto:careers@vexorai.eu?subject=Founding%20Engineer%20Application"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
              >
                Apply Now
                <span aria-hidden="true">&rarr;</span>
              </a>
              <p className="text-sm text-gray-500 mt-3">
                Send your CV and a short note on why you want to build Vexor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Don&apos;t see your role?
          </h2>
          <p className="text-gray-600 mb-6">
            We&apos;re always looking for exceptional people. Reach out anyway.
          </p>
          <a
            href="mailto:careers@vexorai.eu"
            className="text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-4"
          >
            careers@vexorai.eu
          </a>
        </div>
      </section>
    </>
  );
}
