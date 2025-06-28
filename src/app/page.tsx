import { TextInputSection } from "@/components/sections/TextInputSection";
import { BypassDetectorsSection } from "@/components/sections/BypassDetectorsSection";
import { UseCasesSection } from "@/components/sections/UseCasesSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";

export default function Home() {
  return (
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
      <section className="w-full px-4 sm:px-6 md:px-8">
        <FAQSection />
      </section>
    </div>
  );
}
