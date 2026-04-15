"use client";

import { useState } from "react";

const inputClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600";

const selectClasses =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 appearance-none";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      {submitted ? (
        <div className="sm:col-span-2 text-center py-14 animate-in fade-in duration-300">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-lg font-semibold tracking-tight text-gray-900">We will be in touch shortly.</p>
          <p className="text-sm text-gray-500 mt-1.5">Expect a reply within one business day.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="company" className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Company Name
            </label>
            <input
              id="company"
              name="company"
              type="text"
              required
              className={inputClasses}
              placeholder="Acme Capital"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={inputClasses}
              placeholder="you@company.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="portfolio" className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Portfolio Size
            </label>
            <select
              id="portfolio"
              name="portfolio"
              required
              className={selectClasses}
            >
              <option value="">Select range</option>
              <option value="under-1000">Under 1,000 cases</option>
              <option value="1000-10000">1,000 - 10,000 cases</option>
              <option value="10000-50000">10,000 - 50,000 cases</option>
              <option value="50000+">50,000+ cases</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pain" className="text-xs font-medium tracking-wide text-gray-500 uppercase">
              Pain Point
            </label>
            <select
              id="pain"
              name="pain"
              required
              className={selectClasses}
            >
              <option value="">Select area</option>
              <option value="classification">Document classification is manual</option>
              <option value="outreach">Debtor outreach is too slow</option>
              <option value="crm">CRM updates are lagging</option>
              <option value="visibility">No visibility across legal pipeline</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="sm:col-span-2 pt-1">
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 text-white text-sm font-medium px-8 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </>
      )}
    </form>
  );
}
