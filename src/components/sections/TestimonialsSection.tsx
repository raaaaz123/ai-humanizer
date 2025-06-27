"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Content Writer",
      company: "CreativeMinds",
      content: "AI Humanizer has completely transformed my workflow. I can now produce content faster without worrying about AI detection. The humanized text flows naturally and connects with my audience.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Marketing Director",
      company: "GrowthTech",
      content: "As someone who uses AI tools daily, finding a service that can make AI content undetectable was a game-changer. The quality of humanization is impressive, and it passes all detection tools.",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "SEO Specialist",
      company: "RankMasters",
      content: "I've tried several humanization tools, but none compare to AI Humanizer. The text maintains its original meaning while sounding completely human-written. Worth every penny!",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Academic Writer",
      company: "EduScribe",
      content: "Using AI Humanizer for my research summaries has been invaluable. It transforms AI-generated content into natural, flowing text that passes Turnitin with flying colors.",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5
    },
    {
      id: 5,
      name: "Olivia Parker",
      role: "Content Strategist",
      company: "MediaPulse",
      content: "The speed and accuracy of AI Humanizer is impressive. What used to take hours of manual editing now takes minutes, and the results are consistently excellent.",
      avatar: "https://randomuser.me/api/portraits/women/48.jpg",
      rating: 5
    },
    {
      id: 6,
      name: "James Wilson",
      role: "Copywriter",
      company: "WordCraft",
      content: "This tool has become essential in my content creation process. The humanized text maintains the original message while sounding authentic and engaging.",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 4
    }
  ];

  const [activeTestimonials, setActiveTestimonials] = useState<Testimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  useEffect(() => {
    setIsMounted(true);
    const startIdx = currentPage * testimonialsPerPage;
    setActiveTestimonials(testimonials.slice(startIdx, startIdx + testimonialsPerPage));
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ));
  };

  // Show initial testimonials on first render
  useEffect(() => {
    const startIdx = 0;
    setActiveTestimonials(testimonials.slice(startIdx, startIdx + testimonialsPerPage));
  }, []);

  return (
    <section className="py-16 px-4 bg-[#f0f7ff]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-[#64748b] max-w-2xl mx-auto">
            Discover how AI Humanizer is helping professionals across various industries create authentic, human-like content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {activeTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-[#e2e8f0] transition-transform hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-[#64748b]">
                    {testimonial.role}, {testimonial.company}
                  </p>
                  <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                </div>
              </div>
              <p className="text-[#1e293b] italic">&ldquo;{testimonial.content}&rdquo;</p>
            </div>
          ))}
        </div>

        {isMounted && (
          <div className="flex justify-center gap-4">
            <button
              onClick={handlePrevPage}
              className="p-2 rounded-full border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors"
              aria-label="Previous testimonials"
            >
              <svg className="w-5 h-5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2">
              {Array(totalPages)
                .fill(0)
                .map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2.5 h-2.5 rounded-full ${
                      currentPage === i ? "bg-[#3b82f6]" : "bg-[#e2e8f0]"
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
            </div>
            <button
              onClick={handleNextPage}
              className="p-2 rounded-full border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors"
              aria-label="Next testimonials"
            >
              <svg className="w-5 h-5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}; 