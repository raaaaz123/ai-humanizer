"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { theme } from "@/lib/theme";

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
  const [activeIndex, setActiveIndex] = useState(0);
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
          className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ));
  };

  // Auto-scroll testimonials on mobile
  useEffect(() => {
    if (isMounted && window.innerWidth < 768) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isMounted, testimonials.length]);

  // Show initial testimonials on first render
  useEffect(() => {
    const startIdx = 0;
    setActiveTestimonials(testimonials.slice(startIdx, startIdx + testimonialsPerPage));
  }, []);

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            What Our Users Say
          </h2>
          <p className={`text-[${theme.colors.textLight}] max-w-2xl mx-auto text-lg`}>
            Discover how AI Humanizer is helping professionals create authentic, human-like content
          </p>
        </div>

        {/* Desktop View - Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-10">
          {activeTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-start mb-6">
                <div className="mr-4 relative">
                  <div className="absolute -top-2 -left-2 w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300 blur-sm opacity-30"></div>
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full border-2 border-white shadow-sm relative z-10"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className={`text-sm text-[${theme.colors.textLight}]`}>
                    {testimonial.role}, {testimonial.company}
                  </p>
                  <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                </div>
              </div>
              <div className="relative">
                <svg 
                  className={`absolute -top-4 -left-2 w-8 h-8 text-[${theme.colors.primary}] opacity-20`} 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className={`text-[${theme.colors.text}] relative z-10`}>
                  "{testimonial.content}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View - Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-full px-2"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-start mb-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className={`text-xs text-[${theme.colors.textLight}]`}>
                          {testimonial.role}
                        </p>
                        <div className="flex mt-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <p className={`text-[${theme.colors.text}] text-sm`}>
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile pagination indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === i 
                    ? `bg-[${theme.colors.primary}] w-5` 
                    : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop pagination */}
        {isMounted && (
          <div className="hidden md:flex justify-center gap-4 mt-10">
            <button
              onClick={handlePrevPage}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonials"
            >
              <svg className={`w-5 h-5 text-[${theme.colors.primary}]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex gap-2 items-center">
              {Array(totalPages)
                .fill(0)
                .map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      currentPage === i 
                        ? `bg-[${theme.colors.primary}] w-5` 
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to page ${i + 1}`}
                  />
                ))}
            </div>
            <button
              onClick={handleNextPage}
              className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="Next testimonials"
            >
              <svg className={`w-5 h-5 text-[${theme.colors.primary}]`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-lg font-medium text-gray-600">
            <span>Join thousands of satisfied users today</span>
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}; 