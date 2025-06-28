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

// Move testimonials array outside the component to prevent recreation on each render
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Content Writer",
    company: "CreativeMinds",
    content: "Raw Writer has completely transformed my workflow. I can now produce content faster without worrying about AI detection. The humanized text flows naturally and connects with my audience.",
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
    content: "I've tried several humanization tools, but none compare to Raw Writer. The text maintains its original meaning while sounding completely human-written. Worth every penny!",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 4
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Academic Writer",
    company: "EduScribe",
    content: "Using Raw Writer for my research summaries has been invaluable. It transforms AI-generated content into natural, flowing text that passes Turnitin with flying colors.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5
  },
  {
    id: 5,
    name: "Olivia Parker",
    role: "Content Strategist",
    company: "MediaPulse",
    content: "The speed and accuracy of Raw Writer is impressive. What used to take hours of manual editing now takes minutes, and the results are consistently excellent.",
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

// Constants
const TESTIMONIALS_PER_PAGE = 3;
const TOTAL_PAGES = Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE);

export const TestimonialsSection = () => {
  const [activeTestimonials, setActiveTestimonials] = useState<Testimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Initialize component and handle page changes
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
    const startIdx = currentPage * TESTIMONIALS_PER_PAGE;
    setActiveTestimonials(testimonials.slice(startIdx, startIdx + TESTIMONIALS_PER_PAGE));
  }, [currentPage, isMounted]);

  // Auto-scroll testimonials on mobile
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && window.innerWidth < 768) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isMounted]);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % TOTAL_PAGES);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + TOTAL_PAGES) % TOTAL_PAGES);
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

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            What Our Users Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover how Raw Writer is helping professionals create authentic, human-like content
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
                  <p className="text-gray-600 text-sm">
                    {testimonial.role}, {testimonial.company}
                  </p>
                  <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                </div>
              </div>
              <div className="relative">
                <svg 
                  className="absolute -top-4 -left-2 w-8 h-8 text-blue-500 opacity-20"
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-700 relative z-10">
                  &quot;{testimonial.content}&quot;
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
                        width={48}
                        height={48}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {testimonial.role}, {testimonial.company}
                        </p>
                        <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      &quot;{testimonial.content}&quot;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons - Desktop */}
        <div className="hidden md:flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePrevPage}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNextPage}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination Dots - Mobile */}
        <div className="flex md:hidden justify-center mt-4 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === activeIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}; 