"use client";

import { useState } from "react";
import { theme, themeClasses } from "@/lib/theme";

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const useCases: UseCase[] = [
  {
    id: "content-marketing",
    title: "Content Marketing",
    description: "Transform AI-generated marketing content into engaging, human-like copy that resonates with your audience and drives conversions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 14.25V11.625C19.5 9.76104 17.989 8.25 16.125 8.25H14.625C14.0037 8.25 13.5 7.74632 13.5 7.125V5.625C13.5 3.76104 11.989 2.25 10.125 2.25H8.25M8.25 15H15.75M8.25 18H12M10.5 2.25H5.625C5.00368 2.25 4.5 2.75368 4.5 3.375V20.625C4.5 21.2463 5.00368 21.75 5.625 21.75H18.375C18.9963 21.75 19.5 21.2463 19.5 20.625V11.25C19.5 6.27944 15.4706 2.25 10.5 2.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: "academic",
    title: "Academic Writing",
    description: "Ensure your research papers and essays pass AI detection tools like Turnitin while maintaining academic integrity and quality.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: "social-media",
    title: "Social Media",
    description: "Create authentic social media posts that engage followers with a genuine human voice, avoiding the robotic tone of AI.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: "email",
    title: "Email Campaigns",
    description: "Boost open rates and engagement with humanized email copy that feels personal and authentic to your subscribers.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: "product",
    title: "Product Descriptions",
    description: "Create compelling product descriptions that sound natural and persuasive, helping increase conversion rates on your e-commerce site.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    id: "website",
    title: "Website Copy",
    description: "Enhance your website with natural-sounding content that builds trust with visitors and improves SEO performance.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
];

export const UseCasesSection = () => {
  const [hoveredCase, setHoveredCase] = useState<string | null>(null);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-[#f0f7ff]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            How You Can Use Raw Writer
          </h2>
          <p className={`text-[${theme.colors.textLight}] max-w-2xl mx-auto text-lg`}>
            Discover the versatile applications of our AI humanization technology across different content types
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase) => (
            <div 
              key={useCase.id}
              className={`p-8 rounded-xl transition-all duration-300 relative overflow-hidden
                ${hoveredCase === useCase.id 
                  ? 'shadow-lg transform -translate-y-1 bg-white' 
                  : 'shadow-sm hover:shadow-md border border-gray-100 bg-white'}`}
              onMouseEnter={() => setHoveredCase(useCase.id)}
              onMouseLeave={() => setHoveredCase(null)}
            >
              <div 
                className={`text-white p-3 rounded-lg mb-5 inline-flex
                  ${hoveredCase === useCase.id 
                    ? themeClasses.gradientBlue
                    : `bg-[${theme.colors.primary}]`}`}
              >
                <div className="w-6 h-6">
                  {useCase.icon}
                </div>
              </div>
              
              <h3 className={`text-xl font-semibold mb-3 text-[${theme.colors.text}]`}>
                {useCase.title}
              </h3>
              
              <p className={`text-[${theme.colors.textLight}]`}>
                {useCase.description}
              </p>
              
              {hoveredCase === useCase.id && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className={`inline-block py-2 px-4 rounded-full text-sm bg-[${theme.colors.secondary}] text-[${theme.colors.primary}] font-medium`}>
            Perfect for content creators, marketers, students, and professionals
          </div>
        </div>
      </div>
    </section>
  );
}; 