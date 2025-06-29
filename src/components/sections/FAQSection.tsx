"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const FAQSection = () => {
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "What is Raw Writer AI Humanizer?",
      answer: "Raw Writer is an advanced AI humanizer tool that transforms AI-generated content from tools like ChatGPT, Gemini, Claude, or Bard into natural, human-like text. Our technology ensures your content bypasses all AI detection tools like Turnitin, GPTZero, and Content at Scale while maintaining the original meaning and improving readability."
    },
    {
      id: 2,
      question: "How does Raw Writer bypass AI detectors?",
      answer: "Raw Writer uses proprietary technology that analyzes and restructures AI-generated text to mimic human writing patterns. Our system modifies sentence structures, vocabulary choices, and stylistic elements while preserving the original meaning. This makes the content undetectable by AI detection tools that look for patterns typical of AI-generated text."
    },
    {
      id: 3,
      question: "Is Raw Writer free to use?",
      answer: "Yes! Raw Writer offers a free plan that gives you 200 words to humanize. For users who need more capacity, we offer affordable subscription plans with higher word limits and additional features. Our Basic, Pro, and Ultra plans are designed to meet different needs and usage volumes."
    },
    {
      id: 4,
      question: "Which AI detectors can Raw Writer bypass?",
      answer: "Raw Writer can successfully bypass all major AI detection tools including Turnitin, GPTZero, Originality.ai, Content at Scale, Copyleaks, ZeroGPT, Winston AI, and others. Our system is continuously updated to stay ahead of new detection methods and ensure your content remains 100% undetectable."
    },
    {
      id: 5,
      question: "How accurate is Raw Writer's humanization?",
      answer: "Raw Writer achieves a 99.9% success rate in making AI-generated text undetectable. Our advanced algorithms preserve the original meaning while transforming the text to have natural human writing characteristics. The output maintains coherence, readability, and logical flow while eliminating AI fingerprints that detection tools look for."
    },
    {
      id: 6,
      question: "Is it ethical to use an AI humanizer?",
      answer: "AI humanizers like Raw Writer are ethical when used responsibly. Many legitimate uses include improving AI-generated content for better readability, enhancing the natural flow of automatically generated text, and helping non-native speakers create more natural-sounding content. As with any tool, users should follow ethical guidelines and academic integrity policies in their specific contexts."
    },
    {
      id: 7,
      question: "How is Raw Writer different from other AI humanizers?",
      answer: "Raw Writer stands out with its superior accuracy in bypassing AI detection, user-friendly interface, and affordable pricing. Unlike other tools that simply paraphrase text, our advanced algorithms analyze and restructure content to truly mimic human writing patterns. We also offer a free plan, faster processing times, and maintain the original meaning and quality of your content better than competitors."
    },
    {
      id: 8,
      question: "How accurate is the humanization process?",
      answer: "Raw Writer maintains over 95% semantic accuracy, ensuring that the meaning of your original text is preserved while making it sound more human-written."
    },
    {
      id: 9,
      question: "Can I use Raw Writer for academic papers?",
      answer: "Yes, many users utilize Raw Writer for academic writing. The tool ensures that AI-generated research summaries and papers pass plagiarism checks and AI detection tools commonly used in academic settings."
    },
    {
      id: 10,
      question: "Which languages does Raw Writer support?",
      answer: "Raw Writer supports over 50 languages in our premium plans, with 20 languages available in our basic plan. The most commonly used languages include English, Spanish, French, German, Chinese, Japanese, and Arabic."
    },
    {
      id: 11,
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from your account settings. If you cancel, you&apos;ll continue to have access to the service until the end of your current billing period."
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
    <div className="py-24 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about our AI humanizer and how it helps bypass AI detection
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full space-y-6">
        <AccordionItem value="item-1" className="border border-gray-200 rounded-xl shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <h3 className="text-left font-semibold text-lg">What is Raw Writer AI Humanizer?</h3>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-600">
            Raw Writer is an advanced AI humanizer tool that transforms AI-generated content from tools like ChatGPT, Gemini, Claude, or Bard into natural, human-like text. Our technology ensures your content bypasses all AI detection tools like Turnitin, GPTZero, and Content at Scale while maintaining the original meaning and improving readability.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2" className="border border-gray-200 rounded-xl shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <h3 className="text-left font-semibold text-lg">How does Raw Writer bypass AI detectors?</h3>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-600">
            Raw Writer uses proprietary technology that analyzes and restructures AI-generated text to mimic human writing patterns. Our system modifies sentence structures, vocabulary choices, and stylistic elements while preserving the original meaning. This makes the content undetectable by AI detection tools that look for patterns typical of AI-generated text.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-3" className="border border-gray-200 rounded-xl shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <h3 className="text-left font-semibold text-lg">Is Raw Writer free to use?</h3>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-600">
            Yes! Raw Writer offers a free plan that gives you 200 words to humanize. For users who need more capacity, we offer affordable subscription plans with higher word limits and additional features. Our Basic, Pro, and Ultra plans are designed to meet different needs and usage volumes.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-4" className="border border-gray-200 rounded-xl shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <h3 className="text-left font-semibold text-lg">Which AI detectors can Raw Writer bypass?</h3>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-600">
            Raw Writer can successfully bypass all major AI detection tools including Turnitin, GPTZero, Originality.ai, Content at Scale, Copyleaks, ZeroGPT, Winston AI, and others. Our system is continuously updated to stay ahead of new detection methods and ensure your content remains 100% undetectable.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-5" className="border border-gray-200 rounded-xl shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <h3 className="text-left font-semibold text-lg">How accurate is Raw Writer's humanization?</h3>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-600">
            Raw Writer achieves a 99.9% success rate in making AI-generated text undetectable. Our advanced algorithms preserve the original meaning while transforming the text to have natural human writing characteristics. The output maintains coherence, readability, and logical flow while eliminating AI fingerprints that detection tools look for.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-6" className="border border-gray-200 rounded-xl shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <h3 className="text-left font-semibold text-lg">Is it ethical to use an AI humanizer?</h3>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-600">
            AI humanizers like Raw Writer are ethical when used responsibly. Many legitimate uses include improving AI-generated content for better readability, enhancing the natural flow of automatically generated text, and helping non-native speakers create more natural-sounding content. As with any tool, users should follow ethical guidelines and academic integrity policies in their specific contexts.
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-7" className="border border-gray-200 rounded-xl shadow-sm bg-white">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <h3 className="text-left font-semibold text-lg">How is Raw Writer different from other AI humanizers?</h3>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 text-gray-600">
            Raw Writer stands out with its superior accuracy in bypassing AI detection, user-friendly interface, and affordable pricing. Unlike other tools that simply paraphrase text, our advanced algorithms analyze and restructure content to truly mimic human writing patterns. We also offer a free plan, faster processing times, and maintain the original meaning and quality of your content better than competitors.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Still have questions? We're here to help.
        </p>
        <Link href="/support">
          <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#3b82f6] hover:bg-[#2563eb]">
            Contact Support
          </button>
        </Link>
      </div>
    </div>
  );
}; 