"use client";

import { themeClasses } from "@/lib/theme";

interface DetectorItem {
  id: string;
  name: string;
}

const detectors: DetectorItem[] = [
  { id: "gptzero", name: "GPTZero" },
  { id: "openai", name: "OpenAI" },
  { id: "writer", name: "Writer" },
  { id: "quillbot", name: "QuillBot" },
  { id: "copyleaks", name: "Copyleaks" },
  { id: "turnitin", name: "Turnitin" },
  { id: "grammarly", name: "Grammarly" },
  { id: "zerogpt", name: "ZeroGPT" },
];

export const BypassDetectorsSection = () => {
  return (
    <section className={themeClasses.backgroundPrimary + " py-16 px-4 text-center"}>
      <div className="max-w-4xl mx-auto">
        <h2 className={themeClasses.primaryText + " text-3xl font-bold mb-12"}>Bypass AI content detectors</h2>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {detectors.map((detector) => (
            <div key={detector.id} className="flex items-center">
              <svg 
                className="text-[#3b82f6] mr-2" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M8 12L10.5 14.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={themeClasses.primaryText + " text-lg"}>{detector.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 