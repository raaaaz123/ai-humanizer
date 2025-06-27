import { TextInputSection } from "@/components/sections/TextInputSection";
import { BypassDetectorsSection } from "@/components/sections/BypassDetectorsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <main>
      <TextInputSection />
      <BypassDetectorsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
    </main>
  );
}
