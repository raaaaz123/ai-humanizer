import { TextInputSection } from "@/components/sections/TextInputSection";
import { BypassDetectorsSection } from "@/components/sections/BypassDetectorsSection";
import { UseCasesSection } from "@/components/sections/UseCasesSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Raw Writer - Free AI Humanizer | Bypass AI Detectors | 100% Undetectable",
  description: "Transform your AI-generated content into natural, human-like text with Raw Writer. Our advanced AI humanizer bypasses all AI detectors like Turnitin, GPTZero, and Content at Scale. Make your ChatGPT, Gemini, Claude, and Bard content undetectable.",
  keywords: "AI humanizer, bypass AI detection, undetectable AI text, humanize AI content, AI content humanizer, ChatGPT humanizer, AI text converter, AI to human text, AI writing tool, AI detector bypass, make AI text human, free AI humanizer",
  alternates: {
    canonical: "https://rawwriter.com",
  },
};

export default function Home() {
  return (
    <>
      <Script id="structured-data" type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Raw Writer - AI Humanizer",
          "url": "https://rawwriter.com",
          "description": "Raw Writer is the top AI humanizer tool that transforms AI-generated content into 100% human-like text. Bypass AI detectors like Turnitin, GPTZero, and Content at Scale.",
          "applicationCategory": "Productivity",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1024",
            "bestRating": "5",
            "worstRating": "1"
          }
        })
      }} />
      
      <div className="w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="w-full">
          <TextInputSection />
        </section>
        
        {/* Features Sections */}
        <div className="w-full">
          <section className="w-full px-4 sm:px-6 md:px-8">
            <BypassDetectorsSection />
          </section>
          
          <section className="w-full px-4 sm:px-6 md:px-8">
            <UseCasesSection />
          </section>
          
          <section className="w-full px-4 sm:px-6 md:px-8">
            <FeaturesSection />
          </section>
        </div>
        
        {/* Social Proof */}
        <section className="w-full px-4 sm:px-6 md:px-8">
          <TestimonialsSection />
        </section>
        
        {/* FAQ */}
        <section className="w-full px-4 sm:px-6 md:px-8" id="faq">
          <FAQSection />
        </section>
      </div>
    </>
  );
}
