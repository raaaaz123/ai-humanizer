"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Support Center</h1>
        <p className="text-[#64748b] text-center mb-12 max-w-2xl mx-auto">
          Need help with AI Humanizer? Our support team is here to assist you. Fill out the form below or check our FAQ section.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Email Support */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e2e8f0] flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Email Support</h2>
            <p className="text-[#64748b] mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <a href="mailto:support@aihumanizer.com" className="text-[#3b82f6] font-medium hover:underline">
              support@aihumanizer.com
            </a>
          </div>

          {/* Live Chat */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e2e8f0] flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Live Chat</h2>
            <p className="text-[#64748b] mb-4">
              Chat with our support team during business hours.
            </p>
            {isMounted ? (
              <Button variant="outline" className="text-[#3b82f6] border-[#3b82f6]">
                Start Chat
              </Button>
            ) : (
              <div className="px-4 py-2 border rounded-md border-[#3b82f6] text-[#3b82f6]">
                Start Chat
              </div>
            )}
          </div>

          {/* Help Center */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e2e8f0] flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Help Center</h2>
            <p className="text-[#64748b] mb-4">
              Browse our documentation and tutorials.
            </p>
            <Link href="/faq" className="text-[#3b82f6] font-medium hover:underline">
              Visit Help Center
            </Link>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#e2e8f0]">
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          
          {submitted ? (
            <div className="bg-[#f0fdf4] border border-[#86efac] rounded-lg p-4 text-[#16a34a]">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-medium">Thank you for contacting us! We'll get back to you shortly.</p>
              </div>
            </div>
          ) : (
            isMounted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#64748b] mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#64748b] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#64748b] mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="account">Account Issues</option>
                    <option value="billing">Billing Questions</option>
                    <option value="technical">Technical Support</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#64748b] mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-[#e2e8f0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                    required
                  ></textarea>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-10 bg-gray-100 rounded-md"></div>
                  <div className="h-10 bg-gray-100 rounded-md"></div>
                </div>
                <div className="h-10 bg-gray-100 rounded-md"></div>
                <div className="h-32 bg-gray-100 rounded-md"></div>
                <div className="w-32 h-10 bg-[#3b82f6] rounded-md"></div>
              </div>
            )
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e2e8f0]">
              <h3 className="text-lg font-medium mb-2">How do I reset my password?</h3>
              <p className="text-[#64748b]">
                You can reset your password by clicking on the "Forgot Password" link on the login page. You'll receive an email with instructions to reset your password.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e2e8f0]">
              <h3 className="text-lg font-medium mb-2">How do I cancel my subscription?</h3>
              <p className="text-[#64748b]">
                You can cancel your subscription anytime from your account settings. If you cancel, you'll continue to have access to the service until the end of your current billing period.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e2e8f0]">
              <h3 className="text-lg font-medium mb-2">Can I get a refund?</h3>
              <p className="text-[#64748b]">
                We offer a 7-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, contact our support team within 7 days of your purchase for a full refund.
              </p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/faq" className="text-[#3b82f6] font-medium hover:underline">
              View all FAQs
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 