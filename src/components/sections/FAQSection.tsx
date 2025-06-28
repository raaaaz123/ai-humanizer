"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const FAQSection = () => {
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "What is AI Humanizer?",
      answer: "AI Humanizer is an advanced tool that transforms AI-generated content into natural, human-like text. It helps bypass AI detection tools while maintaining the original meaning and improving readability."
    },
    {
      id: 2,
      question: "How does AI Humanizer work?",
      answer: "Our proprietary technology analyzes AI-generated text and applies sophisticated linguistic transformations to make it indistinguishable from human writing. It adjusts sentence structures, vocabulary, and stylistic elements while preserving the original message."
    },
    {
      id: 3,
      question: "Can AI detection tools identify text processed by AI Humanizer?",
      answer: "No, AI Humanizer is designed to bypass all major AI detection tools including GPTZero, Turnitin, Originality.ai, and others. Our technology continuously evolves to stay ahead of detection methods."
    },
    {
      id: 4,
      question: "Is there a word limit for the free plan?",
      answer: "Yes, the free plan includes 250 words per month. For more extensive usage, we offer various subscription plans with higher word limits and additional features."
    },
    {
      id: 5,
      question: "How accurate is the humanization process?",
      answer: "AI Humanizer maintains over 95% semantic accuracy, ensuring that the meaning of your original text is preserved while making it sound more human-written."
    },
    {
      id: 6,
      question: "Can I use AI Humanizer for academic papers?",
      answer: "Yes, many users utilize AI Humanizer for academic writing. The tool ensures that AI-generated research summaries and papers pass plagiarism checks and AI detection tools commonly used in academic settings."
    },
    {
      id: 7,
      question: "Which languages does AI Humanizer support?",
      answer: "AI Humanizer supports over 50 languages in our premium plans, with 20 languages available in our basic plan. The most commonly used languages include English, Spanish, French, German, Chinese, Japanese, and Arabic."
    },
    {
      id: 8,
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from your account settings. If you cancel, you'll continue to have access to the service until the end of your current billing period."
    }
  ];

  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleItem = (id: number) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            Find answers to common questions about AI Humanizer and how it can help you create more authentic content.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-[#e2e8f0] rounded-lg overflow-hidden bg-white"
            >
              {isMounted ? (
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                >
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-[#64748b] transition-transform ${
                      openItemId === faq.id ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              ) : (
                <div className="w-full flex justify-between items-center p-5 text-left">
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  <svg
                    className="w-5 h-5 text-[#64748b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              )}
              {isMounted && openItemId === faq.id && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-[#64748b]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#64748b] mb-4">
            Still have questions? We're here to help.
          </p>
          <Link href="/support">
            {isMounted ? (
              <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#3b82f6] hover:bg-[#2563eb]">
                Contact Support
              </button>
            ) : (
              <span className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#3b82f6]">
                Contact Support
              </span>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}; 