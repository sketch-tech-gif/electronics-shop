// FILE: src/pages/ReturnsPage.jsx

import { useState } from "react";
import { Link } from "react-router-dom";

const eligibilityRules = [
  "Only customers with completed purchases can request returns.",
  "Return requests must be submitted within 7 days after delivery.",
  "Products must remain unused and in original packaging.",
  "All accessories, manuals and receipts must be included.",
  "Photo/video proof is required for damaged, defective or wrong items."
];

const notEligible = [
  "Used products or items damaged by misuse.",
  "Products returned after 7 days.",
  "Missing accessories or packaging.",
  "Digital/downloadable products.",
  "Final sale items."
];

const processSteps = [
  "Go to My Orders",
  "Select delivered order",
  "Request return/refund",
  "Upload proof",
  "Review",
  "Refund issued"
];

const refundMethods = [
  ["M-Pesa Refund", "1–2 business days"],
  ["Bank Transfer", "3–5 business days"],
  ["Store Credit", "Instant after approval"]
];

function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between text-left font-semibold text-sm md:text-base"
      >
        <span>{question}</span>
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-32 md:pt-44 pb-16 bg-gradient-to-b from-slate-50 via-white to-gray-100">
      <div className="max-w-5xl mx-auto px-4 md:px-6">

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] p-6 md:p-10">

          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-8">
            <Link to="/">Home</Link>
            <span className="mx-2">/</span>
            Returns & Refunds
          </div>

          {/* Hero */}
          <section className="border-b border-gray-200 pb-10 mb-10">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
              Returns & Refund Policy
            </h1>

            <p className="text-gray-600 max-w-3xl text-[15px] md:text-base leading-relaxed mb-4">
              Returns are only available for verified purchases. If your order qualifies,
              submit your request directly from your order history for review.
            </p>

            <Link
              to="/orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Go to My Orders →
            </Link>
          </section>

          {/* Eligibility */}
          <section className="border-b border-gray-200 pb-10 mb-10">
            <h2 className="text-2xl font-bold mb-5">Return Eligibility</h2>
            <ul className="space-y-4 text-gray-700 leading-relaxed">
              {eligibilityRules.map((rule) => (
                <li key={rule}>• {rule}</li>
              ))}
            </ul>
          </section>

          {/* Not eligible */}
          <section className="border-b border-gray-200 pb-10 mb-10">
            <h2 className="text-2xl font-bold mb-5">Non-Returnable Items</h2>
            <ul className="space-y-4 text-gray-700 leading-relaxed">
              {notEligible.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </section>

          {/* Process */}
          <section className="border-b border-gray-200 pb-10 mb-10">
            <h2 className="text-2xl font-bold mb-5">How Returns Work</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {processSteps.map((step, index) => (
                <div key={step}>
                  <p className="text-xs text-gray-400 mb-1">Step {index + 1}</p>
                  <p className="font-semibold text-gray-900">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Refund timeline */}
          <section className="border-b border-gray-200 pb-10 mb-10">
            <h2 className="text-2xl font-bold mb-5">Refund Processing Time</h2>
            <div className="space-y-4">
              {refundMethods.map(([method, time]) => (
                <div key={method} className="flex justify-between border-b border-gray-100 pb-3 text-sm md:text-base">
                  <span className="font-medium">{method}</span>
                  <span className="text-gray-600">{time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold mb-5">Frequently Asked Questions</h2>

            <FAQ
              question="Can I return a used item?"
              answer="No. Items must remain unused and in original condition."
            />

            <FAQ
              question="Where do I request a refund?"
              answer="Refund requests are submitted from your order history after login."
            />

            <FAQ
              question="How will I receive my refund?"
              answer="Refunds are processed through M-Pesa, bank transfer or store credit."
            />
          </section>

        </div>
      </div>
    </div>
  );
}
